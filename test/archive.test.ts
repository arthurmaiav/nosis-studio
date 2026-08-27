import { afterEach, describe, expect, test } from "bun:test";
import { mkdtemp, rm, writeFile, mkdir } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { ArchiveReader, syncArchive } from "../src/archive/index.ts";

const temporaryDirectories: string[] = [];

async function fixtureSnapshot(): Promise<string> {
  const root = await mkdtemp(join(tmpdir(), "nosis-archive-"));
  temporaryDirectories.push(root);
  await mkdir(join(root, "residents"), { recursive: true });
  await writeFile(join(root, "manifest.json"), JSON.stringify({
    built: "2026-08-27T12:00:00Z",
    mail_letters: 2,
    residents: 2,
    events: 1,
    note: "test"
  }));
  await writeFile(join(root, "mail.jsonl"), [
    JSON.stringify({ t: 1_700_000_000, iso: "2023-11-14T22:13:20Z", from: "Worker", to: "Treasurer", subject: "Return", body: "I need to return the extra payment." }),
    JSON.stringify({ t: 1_700_000_100, iso: "2023-11-14T22:15:00Z", from: "Treasurer", to: "Worker", subject: "Receipt", body: "Send the onchain transaction receipt." })
  ].join("\n"));
  await writeFile(join(root, "events.jsonl"), JSON.stringify({
    t: 1_700_000_200,
    iso: "2023-11-14T22:16:40Z",
    kind: "payment",
    who: "Worker",
    what: "The return settled."
  }));
  await writeFile(join(root, "residents.json"), JSON.stringify([
    { name: "Worker", whois: "A resident who completes tasks.", journal_bytes: 20 },
    { name: "Treasurer", whois: "A resident who watches the ledger.", journal_bytes: 24 }
  ]));
  await writeFile(join(root, "residents", "Worker.json"), JSON.stringify({
    name: "Worker",
    whois: "A resident who completes tasks.",
    journal: "Returned the extra payment."
  }));
  await writeFile(join(root, "residents", "Treasurer.json"), JSON.stringify({
    name: "Treasurer",
    whois: "A resident who watches the ledger.",
    journal: "Requested the transaction receipt."
  }));
  return root;
}

afterEach(async () => {
  await Promise.all(temporaryDirectories.splice(0).map((path) => rm(path, {
    recursive: true,
    force: true
  })));
});

describe("archive", () => {
  test("indexes a named snapshot and returns stable evidence", async () => {
    const snapshot = await fixtureSnapshot();
    const databasePath = join(snapshot, "studio.sqlite");
    const result = await syncArchive({
      sourceUrl: "https://example.test/history/",
      rawDataDirectory: snapshot,
      databasePath,
      snapshotDirectory: snapshot
    });
    expect(result.indexedRecords).toBe(7);
    expect(result.reusedIndex).toBeFalse();

    const archive = new ArchiveReader(databasePath);
    const first = archive.search("return extra", { limit: 5 });
    const second = archive.search("return extra", { limit: 5 });
    const mail = first.find((record) => record.locator === "mail:1");
    const repeatedMail = second.find((record) => record.locator === "mail:1");
    expect(mail).toBeDefined();
    expect(mail?.id).toBe(repeatedMail?.id);
    archive.close();
  });
});
