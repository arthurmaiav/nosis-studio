import { join } from "node:path";
import type { ArchiveReader, ArchiveRecord } from "../archive/index.ts";
import { readJsonFile, writeJsonFile, writeTextFile } from "../lib/files.ts";
import { bullet, code, excerpt, heading } from "../lib/markdown.ts";
import {
  EpisodeSpecSchema,
  EvidencePacketSchema,
  type EpisodeClaim,
  type EvidencePacket
} from "./schemas.ts";

function recordEvidence(record: ArchiveRecord): EvidencePacket["claims"][number]["evidence"][number] {
  return {
    id: record.id,
    locator: record.locator,
    sourceType: record.sourceType,
    iso: record.iso,
    actor: record.actor,
    target: record.target,
    subject: record.subject,
    body: record.body
  };
}

function findClaimEvidence(archive: ArchiveReader, claim: EpisodeClaim): ArchiveRecord[] {
  const matches = new Map<string, ArchiveRecord>();
  for (const term of claim.searchTerms) {
    const records = archive.search(term, {
      ...(claim.sourceTypes ? { sourceTypes: claim.sourceTypes } : {}),
      ...(claim.actors ? { actors: claim.actors } : {}),
      limit: 12
    });
    for (const record of records) {
      matches.set(record.id, record);
    }
  }
  const normalizedTerms = claim.searchTerms.map((term) => term.toLowerCase().replace(/\s+/g, " "));
  function relevance(record: ArchiveRecord): number {
    const text = `${record.subject} ${record.body}`.toLowerCase().replace(/\s+/g, " ");
    const termScore = Math.max(...normalizedTerms.map((term) => {
      const tokens = term.match(/[a-z0-9]+/g) ?? [];
      const matched = tokens.filter((token) => text.includes(token)).length;
      const coverage = tokens.length === 0 ? 0 : matched / tokens.length;
      return coverage * 100 + tokens.length * 2 + (text.includes(term) ? 200 : 0);
    }));
    const pairScore = claim.actors && claim.actors.includes(record.actor) && claim.actors.includes(record.target)
      ? 40
      : 0;
    return termScore + pairScore;
  }
  return [...matches.values()]
    .sort((left, right) => {
      const scoreDifference = relevance(right) - relevance(left);
      return scoreDifference !== 0
        ? scoreDifference
        : (left.timestamp ?? 0) - (right.timestamp ?? 0);
    })
    .slice(0, 5);
}

function packetMarkdown(packet: EvidencePacket): string {
  const lines = [
    heading(1, packet.title),
    "",
    `Archive build: ${code(packet.archiveBuild)}`,
    "",
    heading(2, "Story"),
    "",
    bullet(`Premise: ${packet.story.premise}`),
    bullet(`Protagonist: ${packet.story.protagonist}`),
    bullet(`Want: ${packet.story.want}`),
    bullet(`Obstacle: ${packet.story.obstacle}`),
    bullet(`Reversal: ${packet.story.reversal}`),
    bullet(`Payoff: ${packet.story.payoff}`),
    "",
    heading(2, "Archive claims"),
    ""
  ];

  for (const claim of packet.claims) {
    lines.push(heading(3, claim.statement), "");
    for (const evidence of claim.evidence) {
      lines.push(
        bullet(`${code(evidence.id)} at ${code(evidence.locator)}, ${evidence.iso ?? "time not recorded"}`),
        `  - ${evidence.actor}${evidence.target ? ` to ${evidence.target}` : ""}: ${excerpt(evidence.subject, 140)}`,
        `  - Record: ${excerpt(evidence.body)}`
      );
    }
    lines.push("");
  }

  lines.push(heading(2, "Onchain receipts"), "");
  for (const receipt of packet.receipts) {
    lines.push(
      heading(3, receipt.label),
      "",
      bullet(`Network: ${receipt.network}`),
      bullet(`Signature: ${code(receipt.signature)}`),
      bullet(`Link: ${receipt.url}`),
      bullet(`Verified: ${receipt.verifiedAt}`),
      ...receipt.facts.map((fact) => bullet(fact)),
      ""
    );
  }

  lines.push(heading(2, "Adaptation notes"), "");
  lines.push(...packet.adaptationNotes.map((note) => bullet(note)), "");
  lines.push(heading(2, "Narrator draft"), "", packet.narratorDraft, "");
  return lines.join("\n");
}

export async function developStory(
  archive: ArchiveReader,
  specPath: string,
  outputDirectory: string
): Promise<{ packet: EvidencePacket; jsonPath: string; markdownPath: string }> {
  const spec = EpisodeSpecSchema.parse(await readJsonFile(specPath));
  const claims = spec.claims.map((claim) => {
    const evidence = findClaimEvidence(archive, claim);
    if (claim.required && evidence.length === 0) {
      throw new Error(`Required claim has no archive evidence: ${claim.id}`);
    }
    return {
      id: claim.id,
      statement: claim.statement,
      required: claim.required,
      evidence: evidence.map(recordEvidence)
    };
  });

  const packet = EvidencePacketSchema.parse({
    episodeId: spec.id,
    title: spec.title,
    archiveBuild: archive.snapshot.builtAt,
    archiveSnapshotId: archive.snapshot.id,
    generatedAt: new Date().toISOString(),
    story: {
      premise: spec.premise,
      protagonist: spec.protagonist,
      want: spec.want,
      obstacle: spec.obstacle,
      reversal: spec.reversal,
      payoff: spec.payoff
    },
    claims,
    receipts: spec.receipts,
    adaptationNotes: spec.adaptationNotes,
    narratorDraft: spec.narratorDraft
  });

  const jsonPath = join(outputDirectory, "evidence.json");
  const markdownPath = join(outputDirectory, "evidence.md");
  await writeJsonFile(jsonPath, packet);
  await writeTextFile(markdownPath, packetMarkdown(packet));
  return { packet, jsonPath, markdownPath };
}
