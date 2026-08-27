import { Database } from "bun:sqlite";
import { z } from "zod";
import type {
  ArchiveRecord,
  ArchiveSearchOptions,
  ArchiveSnapshot,
  ArchiveSourceType
} from "./types.ts";

const SnapshotRowSchema = z.object({
  id: z.string(),
  built_at: z.string(),
  source_url: z.string(),
  raw_directory: z.string(),
  manifest_json: z.string()
});

const RecordRowSchema = z.object({
  id: z.string(),
  snapshot_id: z.string(),
  source_type: z.enum(["mail", "event", "resident", "journal"]),
  iso: z.string().nullable(),
  timestamp: z.number().nullable(),
  actor: z.string(),
  target: z.string(),
  subject: z.string(),
  body: z.string(),
  locator: z.string(),
  metadata_json: z.string(),
  rank: z.number().nullable().optional()
});

function mapRecord(value: unknown): ArchiveRecord {
  const row = RecordRowSchema.parse(value);
  const metadata = JSON.parse(row.metadata_json) as unknown;
  return {
    id: row.id,
    snapshotId: row.snapshot_id,
    sourceType: row.source_type,
    iso: row.iso,
    timestamp: row.timestamp,
    actor: row.actor,
    target: row.target,
    subject: row.subject,
    body: row.body,
    locator: row.locator,
    metadata: z.record(z.string(), z.unknown()).parse(metadata),
    rank: row.rank ?? null
  };
}

function searchExpression(value: string): string {
  const tokens = value.normalize("NFKC").match(/[\p{L}\p{N}_-]+/gu) ?? [];
  const useful = tokens.filter((token) => token.length > 1);
  if (useful.length === 0) {
    return "";
  }
  return useful.map((token) => `"${token.replaceAll('"', '""')}"`).join(" AND ");
}

function matchesFilters(record: ArchiveRecord, options: ArchiveSearchOptions): boolean {
  if (options.sourceTypes && !options.sourceTypes.includes(record.sourceType)) {
    return false;
  }
  if (options.actors && !options.actors.includes(record.actor) && !options.actors.includes(record.target)) {
    return false;
  }
  return true;
}

export class ArchiveReader {
  readonly snapshot: ArchiveSnapshot;
  readonly #database: Database;

  constructor(databasePath: string) {
    this.#database = new Database(databasePath, { readonly: true, strict: true });
    const row = SnapshotRowSchema.parse(this.#database.query(`
      SELECT id, built_at, source_url, raw_directory, manifest_json
      FROM snapshots
      ORDER BY built_at DESC
      LIMIT 1
    `).get());
    const manifest = z.object({
      mailLetters: z.number(),
      residents: z.number(),
      events: z.number(),
      note: z.string()
    }).parse(JSON.parse(row.manifest_json));
    this.snapshot = {
      id: row.id,
      builtAt: row.built_at,
      sourceUrl: row.source_url,
      rawDirectory: row.raw_directory,
      manifest
    };
  }

  search(query: string, options: ArchiveSearchOptions = {}): ArchiveRecord[] {
    const limit = Math.min(Math.max(options.limit ?? 20, 1), 500);
    const expression = searchExpression(query);
    let records: ArchiveRecord[] = [];
    if (expression) {
      const rows = this.#database.query(`
        SELECT
          records.id,
          records.snapshot_id,
          records.source_type,
          records.iso,
          records.timestamp,
          records.actor,
          records.target,
          records.subject,
          records.body,
          records.locator,
          records.metadata_json,
          bm25(records_fts, 0.0, 0.0, 0.0, 2.0, 2.0, 5.0, 1.0) AS rank
        FROM records_fts
        JOIN records ON records.id = records_fts.id
        WHERE records_fts MATCH ? AND records_fts.snapshot_id = ?
        ORDER BY rank
        LIMIT ?
      `).all(expression, this.snapshot.id, Math.min(limit * 8, 1000));
      records = rows.map(mapRecord).filter((record) => matchesFilters(record, options));
    }

    if (records.length === 0) {
      const like = `%${query.toLowerCase()}%`;
      const rows = this.#database.query(`
        SELECT
          id, snapshot_id, source_type, iso, timestamp, actor, target,
          subject, body, locator, metadata_json, NULL AS rank
        FROM records
        WHERE snapshot_id = ?
          AND (lower(subject) LIKE ? OR lower(body) LIKE ?)
        ORDER BY timestamp
        LIMIT ?
      `).all(this.snapshot.id, like, like, Math.min(limit * 8, 1000));
      records = rows.map(mapRecord).filter((record) => matchesFilters(record, options));
    }

    return records.slice(0, limit);
  }

  records(sourceTypes?: ArchiveSourceType[]): ArchiveRecord[] {
    const rows = this.#database.query(`
      SELECT
        id, snapshot_id, source_type, iso, timestamp, actor, target,
        subject, body, locator, metadata_json, NULL AS rank
      FROM records
      WHERE snapshot_id = ?
      ORDER BY COALESCE(timestamp, 0), locator
    `).all(this.snapshot.id);
    const records = rows.map(mapRecord);
    return sourceTypes
      ? records.filter((record) => sourceTypes.includes(record.sourceType))
      : records;
  }

  getByLocator(locator: string): ArchiveRecord | null {
    const row = this.#database.query(`
      SELECT
        id, snapshot_id, source_type, iso, timestamp, actor, target,
        subject, body, locator, metadata_json, NULL AS rank
      FROM records
      WHERE snapshot_id = ? AND locator = ?
      LIMIT 1
    `).get(this.snapshot.id, locator);
    return row ? mapRecord(row) : null;
  }

  getById(id: string): ArchiveRecord | null {
    const row = this.#database.query(`
      SELECT
        id, snapshot_id, source_type, iso, timestamp, actor, target,
        subject, body, locator, metadata_json, NULL AS rank
      FROM records
      WHERE snapshot_id = ? AND id = ?
      LIMIT 1
    `).get(this.snapshot.id, id);
    return row ? mapRecord(row) : null;
  }

  close(): void {
    this.#database.close();
  }
}
