import { join } from "node:path";
import type { ArchiveReader, ArchiveRecord } from "../archive/index.ts";
import { writeJsonFile, writeTextFile, sha256 } from "../lib/files.ts";
import { bullet, code, excerpt, heading } from "../lib/markdown.ts";
import { StoryCandidateSchema, type StoryCandidate } from "./schemas.ts";

type CandidateGroup = {
  participants: [string, string];
  records: ArchiveRecord[];
  speakers: Set<string>;
  conflictSignals: number;
  paymentSignals: number;
  receiptSignals: number;
};

const conflictPattern = /\b(?:accus|argument|bug|cannot|censor|conflict|dispute|duplicate|error|fail|groundless|halt|impossible|liabil|missing|overpaid|punish|refus|reject|return|wrong)\w*/gi;
const paymentPattern = /\b(?:bank|gas|ledger|nosis|overpaid|paid|payment|receipt|settle|sol|treasury|wage|wallet)\w*/gi;
const receiptPattern = /\b(?:onchain|on-chain|receipt|signature|solscan|transaction)\w*/gi;
const noisePattern = /(?:hourly|ran a shift|shift report|report: .* shift|the studio --|watch changed|tail of its record|receipt\. your post|the wire refused)/i;
const genericSubjectPattern = /^(?:from:.*|report|shift report|receipt|re:.*|fw:.*)$/i;
const systemActors = new Set(["", "bell", "clock", "voice", "wire"]);

function countMatches(value: string, pattern: RegExp): number {
  return value.match(pattern)?.length ?? 0;
}

function threeHourWindow(timestamp: number): number {
  return Math.floor(timestamp / 10_800) * 10_800;
}

function groupKey(record: ArchiveRecord): string | null {
  if (!record.timestamp || !record.actor || !record.target || record.actor === record.target) {
    return null;
  }
  const pair = [record.actor, record.target].sort((left, right) => left.localeCompare(right));
  return `${threeHourWindow(record.timestamp)}:${pair[0]}:${pair[1]}`;
}

function candidateTitle(group: CandidateGroup): string {
  const strongest = [...group.records].sort((left, right) => {
    const leftScore = countMatches(`${left.subject} ${left.body}`, conflictPattern)
      + countMatches(`${left.subject} ${left.body}`, paymentPattern);
    const rightScore = countMatches(`${right.subject} ${right.body}`, conflictPattern)
      + countMatches(`${right.subject} ${right.body}`, paymentPattern);
    return rightScore - leftScore;
  })[0];
  const subject = strongest?.subject.trim();
  if (
    subject
    && subject.length <= 90
    && !noisePattern.test(subject)
    && !genericSubjectPattern.test(subject)
  ) {
    return subject.replace(/^from:\s*/i, "");
  }
  return `${group.participants[0]} and ${group.participants[1]} incident`;
}

function candidateFromGroup(key: string, group: CandidateGroup, snapshotId: string): StoryCandidate {
  const timestamps = group.records
    .map((record) => record.timestamp)
    .filter((value): value is number => value !== null)
    .sort((left, right) => left - right);
  const count = group.records.length;
  const reciprocal = group.speakers.size > 1;
  const messageScore = Math.min(Math.log2(count + 1) * 4, 14);
  const conflictDensity = group.conflictSignals / count;
  const paymentDensity = group.paymentSignals / count;
  const receiptDensity = group.receiptSignals / count;
  const score = messageScore
    + Math.min(conflictDensity, 4) * 8
    + Math.min(paymentDensity, 5) * 4
    + Math.min(receiptDensity, 2) * 10
    + (group.receiptSignals > 0 ? 8 : 0)
    + (reciprocal ? 8 : 0)
    - Math.max(count - 16, 0) * 0.75;
  const summary = [
    `${count} relevant direct messages in one three-hour window.`,
    `Two-way exchange: ${reciprocal ? "yes" : "no"}.`,
    `${group.conflictSignals} conflict signals.`,
    `${group.paymentSignals} payment signals.`,
    `${group.receiptSignals} receipt signals.`
  ].join(" ");
  return StoryCandidateSchema.parse({
    id: `candidate-${sha256(`${snapshotId}:${key}`).slice(0, 12)}`,
    snapshotId,
    title: candidateTitle(group),
    summary,
    participants: group.participants,
    startsAt: timestamps[0] ? new Date(timestamps[0] * 1000).toISOString() : null,
    endsAt: timestamps.at(-1) ? new Date((timestamps.at(-1) ?? 0) * 1000).toISOString() : null,
    messageCount: group.records.length,
    conflictSignals: group.conflictSignals,
    paymentSignals: group.paymentSignals,
    receiptSignals: group.receiptSignals,
    transactionBacked: group.receiptSignals > 0,
    score,
    evidenceIds: group.records.slice(0, 12).map((record) => record.id)
  });
}

function candidatesMarkdown(candidates: StoryCandidate[], archiveBuild: string): string {
  const lines = [
    heading(1, "Nosis story candidates"),
    "",
    `Archive build: ${code(archiveBuild)}`,
    "",
    "These are research leads, not approved stories. Transaction evidence improves rank but does not replace editorial review.",
    ""
  ];
  candidates.forEach((candidate, index) => {
    lines.push(
      heading(2, `${index + 1}. ${candidate.title}`),
      "",
      bullet(`ID: ${code(candidate.id)}`),
      bullet(`Score: ${candidate.score.toFixed(1)}`),
      bullet(`Participants: ${candidate.participants.join(", ")}`),
      bullet(`Window: ${candidate.startsAt ?? "unknown"} to ${candidate.endsAt ?? "unknown"}`),
      bullet(`Transaction-backed signal: ${candidate.transactionBacked ? "yes" : "no"}`),
      bullet(candidate.summary),
      ""
    );
  });
  return lines.join("\n");
}

export async function mineStories(
  archive: ArchiveReader,
  outputDirectory: string,
  limit = 25
): Promise<{ candidates: StoryCandidate[]; jsonPath: string; markdownPath: string }> {
  const groups = new Map<string, CandidateGroup>();
  const mail = archive.records(["mail"]);
  for (const record of mail) {
    if (
      systemActors.has(record.actor.toLowerCase())
      || systemActors.has(record.target.toLowerCase())
      || noisePattern.test(record.subject)
      || noisePattern.test(record.body.slice(0, 240))
    ) {
      continue;
    }
    const key = groupKey(record);
    if (!key) {
      continue;
    }
    const pair = [record.actor, record.target].sort((left, right) => left.localeCompare(right));
    const text = `${record.subject}\n${record.body}`;
    const conflictSignals = countMatches(text, conflictPattern);
    const paymentSignals = countMatches(text, paymentPattern);
    const receiptSignals = countMatches(text, receiptPattern);
    if (conflictSignals + paymentSignals + receiptSignals === 0) {
      continue;
    }
    const group = groups.get(key) ?? {
      participants: [pair[0] ?? "unknown", pair[1] ?? "unknown"],
      records: [],
      speakers: new Set<string>(),
      conflictSignals: 0,
      paymentSignals: 0,
      receiptSignals: 0
    };
    group.records.push(record);
    group.speakers.add(record.actor);
    group.conflictSignals += conflictSignals;
    group.paymentSignals += paymentSignals;
    group.receiptSignals += receiptSignals;
    groups.set(key, group);
  }

  const candidates = [...groups.entries()]
    .map(([key, group]) => candidateFromGroup(key, group, archive.snapshot.id))
    .filter((candidate) => candidate.messageCount >= 2 && candidate.score >= 18)
    .sort((left, right) => right.score - left.score)
    .slice(0, Math.min(Math.max(limit, 1), 100));

  const jsonPath = join(outputDirectory, `candidates-${archive.snapshot.id}.json`);
  const markdownPath = join(outputDirectory, `candidates-${archive.snapshot.id}.md`);
  await writeJsonFile(jsonPath, {
    archiveBuild: archive.snapshot.builtAt,
    generatedAt: new Date().toISOString(),
    candidates
  });
  await writeTextFile(markdownPath, candidatesMarkdown(candidates, archive.snapshot.builtAt));
  return { candidates, jsonPath, markdownPath };
}
