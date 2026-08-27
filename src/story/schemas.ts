import { z } from "zod";

export const EpisodeClaimSchema = z.object({
  id: z.string().min(1),
  statement: z.string().min(1),
  searchTerms: z.array(z.string().min(1)).min(1),
  sourceTypes: z.array(z.enum(["mail", "event", "resident", "journal"])).optional(),
  actors: z.array(z.string().min(1)).optional(),
  required: z.boolean().default(true)
});

export const ReceiptSchema = z.object({
  label: z.string().min(1),
  network: z.string().min(1),
  signature: z.string().min(1),
  url: z.url(),
  verifiedAt: z.string().min(1),
  facts: z.array(z.string().min(1)).min(1)
});

export const EpisodeSpecSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  title: z.string().min(1),
  premise: z.string().min(1),
  protagonist: z.string().min(1),
  want: z.string().min(1),
  obstacle: z.string().min(1),
  reversal: z.string().min(1),
  payoff: z.string().min(1),
  cast: z.array(z.string().min(1)).min(1),
  claims: z.array(EpisodeClaimSchema).min(1),
  receipts: z.array(ReceiptSchema),
  adaptationNotes: z.array(z.string().min(1)),
  narratorDraft: z.string().min(1)
});

export type EpisodeSpec = z.infer<typeof EpisodeSpecSchema>;
export type EpisodeClaim = z.infer<typeof EpisodeClaimSchema>;
export type Receipt = z.infer<typeof ReceiptSchema>;

export const StoryCandidateSchema = z.object({
  id: z.string(),
  snapshotId: z.string(),
  title: z.string(),
  summary: z.string(),
  participants: z.array(z.string()),
  startsAt: z.string().nullable(),
  endsAt: z.string().nullable(),
  messageCount: z.number().int(),
  conflictSignals: z.number().int(),
  paymentSignals: z.number().int(),
  receiptSignals: z.number().int(),
  transactionBacked: z.boolean(),
  score: z.number(),
  evidenceIds: z.array(z.string())
});

export type StoryCandidate = z.infer<typeof StoryCandidateSchema>;

export const EvidenceRecordSchema = z.object({
  id: z.string(),
  locator: z.string(),
  sourceType: z.enum(["mail", "event", "resident", "journal"]),
  iso: z.string().nullable(),
  actor: z.string(),
  target: z.string(),
  subject: z.string(),
  body: z.string()
});

export const EvidenceClaimSchema = z.object({
  id: z.string(),
  statement: z.string(),
  required: z.boolean(),
  evidence: z.array(EvidenceRecordSchema)
});

export const EvidencePacketSchema = z.object({
  episodeId: z.string(),
  title: z.string(),
  archiveBuild: z.string(),
  archiveSnapshotId: z.string(),
  generatedAt: z.string(),
  story: z.object({
    premise: z.string(),
    protagonist: z.string(),
    want: z.string(),
    obstacle: z.string(),
    reversal: z.string(),
    payoff: z.string()
  }),
  claims: z.array(EvidenceClaimSchema),
  receipts: z.array(ReceiptSchema),
  adaptationNotes: z.array(z.string()),
  narratorDraft: z.string()
});

export type EvidencePacket = z.infer<typeof EvidencePacketSchema>;
