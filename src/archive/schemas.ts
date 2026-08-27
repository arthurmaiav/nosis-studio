import { z } from "zod";

export const ArchiveManifestSchema = z.object({
  built: z.string().min(1),
  mail_letters: z.number().int().nonnegative(),
  residents: z.number().int().nonnegative(),
  events: z.number().int().nonnegative(),
  note: z.string()
});

export const MailRecordSchema = z.object({
  t: z.number(),
  iso: z.string().min(1),
  from: z.string(),
  to: z.string(),
  subject: z.string(),
  body: z.string()
});

export const EventRecordSchema = z.object({
  t: z.number(),
  iso: z.string().min(1),
  kind: z.string().min(1),
  who: z.string(),
  what: z.string()
});

export const ResidentIndexRecordSchema = z.object({
  name: z.string().min(1),
  whois: z.string(),
  journal_bytes: z.number().int().nonnegative()
});

export const ResidentIndexSchema = z.array(ResidentIndexRecordSchema);

export const ResidentRecordSchema = z.object({
  name: z.string().min(1),
  whois: z.string(),
  journal: z.string()
});

export type ArchiveManifest = z.infer<typeof ArchiveManifestSchema>;
export type MailRecord = z.infer<typeof MailRecordSchema>;
export type EventRecord = z.infer<typeof EventRecordSchema>;
export type ResidentIndexRecord = z.infer<typeof ResidentIndexRecordSchema>;
export type ResidentRecord = z.infer<typeof ResidentRecordSchema>;
