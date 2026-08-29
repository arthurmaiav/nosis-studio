import { z } from "zod";

const IdSchema = z.string().min(1).regex(/^[a-z0-9-]+$/);

export const AdaptationDialogueSchema = z.object({
  speaker: z.string().min(1),
  text: z.string().min(1)
});

export const AdaptationUnitSchema = z.object({
  id: IdSchema,
  sequence: z.number().int().positive(),
  title: z.string().min(1),
  purpose: z.string().min(1),
  sourceClaimIds: z.array(IdSchema).min(1),
  cast: z.array(IdSchema).min(1),
  scene: z.string().min(1),
  action: z.string().min(1),
  composition: z.string().min(1),
  postText: z.object({
    headline: z.string().min(1).optional(),
    dialogue: z.array(AdaptationDialogueSchema),
    captions: z.array(z.string().min(1)),
    labels: z.array(z.string().min(1))
  }),
  continuity: z.array(z.string().min(1)).min(1)
});

export const AdaptationScriptSchema = z.object({
  schemaVersion: z.literal(1),
  episodeId: IdSchema,
  formatId: IdSchema,
  title: z.string().min(1),
  evidenceSource: z.object({
    kind: z.enum(["archive-evidence", "live-feed-evidence"]),
    path: z.string().min(1),
    status: z.enum(["verified", "provisional-live"])
  }),
  layout: z.string().min(1),
  units: z.array(AdaptationUnitSchema).min(1)
}).superRefine((script, context) => {
  const ids = new Set<string>();
  const sequences = new Set<number>();
  for (const unit of script.units) {
    if (ids.has(unit.id)) {
      context.addIssue({
        code: "custom",
        message: `Duplicate adaptation unit ID: ${unit.id}`,
        path: ["units"]
      });
    }
    if (sequences.has(unit.sequence)) {
      context.addIssue({
        code: "custom",
        message: `Duplicate adaptation sequence: ${unit.sequence}`,
        path: ["units"]
      });
    }
    ids.add(unit.id);
    sequences.add(unit.sequence);
  }
});

export type AdaptationScript = z.infer<typeof AdaptationScriptSchema>;
export type AdaptationUnit = z.infer<typeof AdaptationUnitSchema>;
