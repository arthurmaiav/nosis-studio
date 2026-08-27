import { Database } from "bun:sqlite";
import { access, mkdir, readFile, writeFile } from "node:fs/promises";
import { basename, join, resolve } from "node:path";
import { z } from "zod";
import { readJsonFile, safeSegment, sha256 } from "../lib/files.ts";
import {
  ArchiveManifestSchema,
  EventRecordSchema,
  MailRecordSchema,
  ResidentIndexSchema,
  ResidentRecordSchema
} from "./schemas.ts";
import type {
  ArchiveRecord,
  ArchiveSnapshot,
  ArchiveSourceType,
  SyncArchiveOptions,
  SyncArchiveResult
} from "./types.ts";

const SnapshotRowSchema = z.object({
  id: z.string(),
  record_count: z.number()
});

function createSchema(database: Database): void {
  database.exec(`
    PRAGMA journal_mode = WAL;
    PRAGMA synchronous = NORMAL;
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS snapshots (
      id TEXT PRIMARY KEY,
      built_at TEXT NOT NULL,
      source_url TEXT NOT NULL,
      synced_at TEXT NOT NULL,
      raw_directory TEXT NOT NULL,
      manifest_json TEXT NOT NULL,
      record_count INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS records (
      id TEXT PRIMARY KEY,
      snapshot_id TEXT NOT NULL REFERENCES snapshots(id) ON DELETE CASCADE,
      source_type TEXT NOT NULL,
      iso TEXT,
      timestamp REAL,
      actor TEXT NOT NULL,
      target TEXT NOT NULL,
      subject TEXT NOT NULL,
      body TEXT NOT NULL,
      locator TEXT NOT NULL,
      metadata_json TEXT NOT NULL,
      UNIQUE(snapshot_id, locator)
    );

    CREATE INDEX IF NOT EXISTS records_snapshot_type_idx
      ON records(snapshot_id, source_type);
    CREATE INDEX IF NOT EXISTS records_snapshot_actor_idx
      ON records(snapshot_id, actor, target);
    CREATE INDEX IF NOT EXISTS records_snapshot_locator_idx
      ON records(snapshot_id, locator);

    CREATE VIRTUAL TABLE IF NOT EXISTS records_fts USING fts5(
      id UNINDEXED,
      snapshot_id UNINDEXED,
      source_type UNINDEXED,
      actor,
      target,
      subject,
      body,
      tokenize = 'porter unicode61'
    );
  `);
}

async function exists(path: string): Promise<boolean> {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

async function fetchJson(url: string): Promise<unknown> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Archive request failed with ${response.status}: ${url}`);
  }
  return response.json();
}

async function downloadFile(url: string, path: string, force: boolean): Promise<void> {
  if (!force && await exists(path)) {
    return;
  }
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Archive download failed with ${response.status}: ${url}`);
  }
  await mkdir(resolve(path, ".."), { recursive: true });
  await writeFile(path, new Uint8Array(await response.arrayBuffer()));
}

function snapshotIdFromBuild(builtAt: string): string {
  return builtAt.replaceAll(/[-:]/g, "").replace(".000Z", "Z");
}

async function prepareRemoteSnapshot(options: SyncArchiveOptions): Promise<string> {
  const sourceUrl = options.sourceUrl.endsWith("/")
    ? options.sourceUrl
    : `${options.sourceUrl}/`;
  const manifest = ArchiveManifestSchema.parse(await fetchJson(`${sourceUrl}manifest.json`));
  const snapshotDirectory = join(options.rawDataDirectory, snapshotIdFromBuild(manifest.built));
  await mkdir(join(snapshotDirectory, "residents"), { recursive: true });

  await downloadFile(
    `${sourceUrl}manifest.json`,
    join(snapshotDirectory, "manifest.json"),
    options.forceDownload ?? false
  );
  await downloadFile(
    `${sourceUrl}mail.jsonl`,
    join(snapshotDirectory, "mail.jsonl"),
    options.forceDownload ?? false
  );
  await downloadFile(
    `${sourceUrl}events.jsonl`,
    join(snapshotDirectory, "events.jsonl"),
    options.forceDownload ?? false
  );
  await downloadFile(
    `${sourceUrl}residents.json`,
    join(snapshotDirectory, "residents.json"),
    options.forceDownload ?? false
  );

  const residents = ResidentIndexSchema.parse(
    await readJsonFile(join(snapshotDirectory, "residents.json"))
  );
  for (const resident of residents) {
    await downloadFile(
      `${sourceUrl}residents/${encodeURIComponent(resident.name)}.json`,
      join(snapshotDirectory, "residents", `${resident.name}.json`),
      options.forceDownload ?? false
    );
  }

  return snapshotDirectory;
}

function stableRecordId(record: Omit<ArchiveRecord, "id" | "rank">): string {
  const source = [
    record.snapshotId,
    record.sourceType,
    record.locator,
    record.iso ?? "",
    record.actor,
    record.target,
    record.subject,
    record.body
  ].join("\u0000");
  return `${record.sourceType}_${sha256(source).slice(0, 24)}`;
}

function parseJsonLines<T>(text: string, schema: z.ZodType<T>, source: string): T[] {
  const records: T[] = [];
  const lines = text.split("\n");
  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index]?.trim();
    if (!line) {
      continue;
    }
    try {
      records.push(schema.parse(JSON.parse(line)));
    } catch (error) {
      throw new Error(`${source}:${index + 1} is not a valid archive record`, { cause: error });
    }
  }
  return records;
}

function insertRecord(
  insertRecordStatement: ReturnType<Database["prepare"]>,
  insertFtsStatement: ReturnType<Database["prepare"]>,
  value: Omit<ArchiveRecord, "id" | "rank">
): void {
  const record: ArchiveRecord = {
    ...value,
    id: stableRecordId(value),
    rank: null
  };
  insertRecordStatement.run(
    record.id,
    record.snapshotId,
    record.sourceType,
    record.iso,
    record.timestamp,
    record.actor,
    record.target,
    record.subject,
    record.body,
    record.locator,
    JSON.stringify(record.metadata)
  );
  insertFtsStatement.run(
    record.id,
    record.snapshotId,
    record.sourceType,
    record.actor,
    record.target,
    record.subject,
    record.body
  );
}

function sourceRecord(
  snapshotId: string,
  sourceType: ArchiveSourceType,
  locator: string,
  values: Omit<ArchiveRecord, "id" | "snapshotId" | "sourceType" | "locator" | "rank">
): Omit<ArchiveRecord, "id" | "rank"> {
  return {
    snapshotId,
    sourceType,
    locator,
    ...values
  };
}

async function indexSnapshot(
  database: Database,
  snapshot: ArchiveSnapshot,
  force: boolean
): Promise<{ count: number; reused: boolean }> {
  const existing = database
    .query("SELECT id, record_count FROM snapshots WHERE id = ?")
    .get(snapshot.id);
  if (existing && !force) {
    const row = SnapshotRowSchema.parse(existing);
    return { count: row.record_count, reused: true };
  }

  const manifestJson = JSON.stringify(snapshot.manifest);
  database.exec("BEGIN IMMEDIATE");
  try {
    database.query("DELETE FROM records_fts WHERE snapshot_id = ?").run(snapshot.id);
    database.query("DELETE FROM records WHERE snapshot_id = ?").run(snapshot.id);
    database.query(`
      INSERT INTO snapshots (
        id, built_at, source_url, synced_at, raw_directory, manifest_json, record_count
      ) VALUES (?, ?, ?, ?, ?, ?, 0)
      ON CONFLICT(id) DO UPDATE SET
        built_at = excluded.built_at,
        source_url = excluded.source_url,
        synced_at = excluded.synced_at,
        raw_directory = excluded.raw_directory,
        manifest_json = excluded.manifest_json,
        record_count = 0
    `).run(
      snapshot.id,
      snapshot.builtAt,
      snapshot.sourceUrl,
      new Date().toISOString(),
      snapshot.rawDirectory,
      manifestJson
    );

    const insertRecordStatement = database.prepare(`
      INSERT INTO records (
        id, snapshot_id, source_type, iso, timestamp, actor, target,
        subject, body, locator, metadata_json
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    const insertFtsStatement = database.prepare(`
      INSERT INTO records_fts (
        id, snapshot_id, source_type, actor, target, subject, body
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    let count = 0;
    const mailRecords = parseJsonLines(
      await readFile(join(snapshot.rawDirectory, "mail.jsonl"), "utf8"),
      MailRecordSchema,
      "mail.jsonl"
    );
    for (let index = 0; index < mailRecords.length; index += 1) {
      const mail = mailRecords[index];
      if (!mail) {
        continue;
      }
      insertRecord(insertRecordStatement, insertFtsStatement, sourceRecord(
        snapshot.id,
        "mail",
        `mail:${index + 1}`,
        {
          iso: mail.iso,
          timestamp: mail.t,
          actor: mail.from,
          target: mail.to,
          subject: mail.subject,
          body: mail.body,
          metadata: { line: index + 1 }
        }
      ));
      count += 1;
    }

    const eventRecords = parseJsonLines(
      await readFile(join(snapshot.rawDirectory, "events.jsonl"), "utf8"),
      EventRecordSchema,
      "events.jsonl"
    );
    for (let index = 0; index < eventRecords.length; index += 1) {
      const event = eventRecords[index];
      if (!event) {
        continue;
      }
      insertRecord(insertRecordStatement, insertFtsStatement, sourceRecord(
        snapshot.id,
        "event",
        `event:${index + 1}`,
        {
          iso: event.iso,
          timestamp: event.t,
          actor: event.who,
          target: "",
          subject: event.kind,
          body: event.what,
          metadata: { line: index + 1, kind: event.kind }
        }
      ));
      count += 1;
    }

    const residentIndex = ResidentIndexSchema.parse(
      await readJsonFile(join(snapshot.rawDirectory, "residents.json"))
    );
    for (const residentSummary of residentIndex) {
      const resident = ResidentRecordSchema.parse(
        await readJsonFile(join(snapshot.rawDirectory, "residents", `${residentSummary.name}.json`))
      );
      insertRecord(insertRecordStatement, insertFtsStatement, sourceRecord(
        snapshot.id,
        "resident",
        `resident:${resident.name}`,
        {
          iso: null,
          timestamp: null,
          actor: resident.name,
          target: "",
          subject: "whois",
          body: resident.whois,
          metadata: { name: resident.name, journalBytes: residentSummary.journal_bytes }
        }
      ));
      insertRecord(insertRecordStatement, insertFtsStatement, sourceRecord(
        snapshot.id,
        "journal",
        `journal:${resident.name}`,
        {
          iso: null,
          timestamp: null,
          actor: resident.name,
          target: "",
          subject: "journal",
          body: resident.journal,
          metadata: { name: resident.name, bytes: residentSummary.journal_bytes }
        }
      ));
      count += 2;
    }

    database.query("UPDATE snapshots SET record_count = ? WHERE id = ?").run(count, snapshot.id);
    database.exec("COMMIT");
    return { count, reused: false };
  } catch (error) {
    database.exec("ROLLBACK");
    throw error;
  }
}

export async function syncArchive(options: SyncArchiveOptions): Promise<SyncArchiveResult> {
  const rawDirectory = options.snapshotDirectory
    ? resolve(options.snapshotDirectory)
    : await prepareRemoteSnapshot(options);
  const manifest = ArchiveManifestSchema.parse(
    await readJsonFile(join(rawDirectory, "manifest.json"))
  );
  const snapshot: ArchiveSnapshot = {
    id: snapshotIdFromBuild(manifest.built),
    builtAt: manifest.built,
    sourceUrl: options.sourceUrl,
    rawDirectory,
    manifest: {
      mailLetters: manifest.mail_letters,
      residents: manifest.residents,
      events: manifest.events,
      note: manifest.note
    }
  };

  await mkdir(resolve(options.databasePath, ".."), { recursive: true });
  const database = new Database(options.databasePath, { create: true, strict: true });
  try {
    createSchema(database);
    const indexed = await indexSnapshot(database, snapshot, options.forceIndex ?? false);
    return {
      snapshot,
      databasePath: options.databasePath,
      indexedRecords: indexed.count,
      reusedIndex: indexed.reused
    };
  } finally {
    database.close();
  }
}
