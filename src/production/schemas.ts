import { z } from "zod";

export const ProviderSettingsSchema = z.object({
  provider: z.string(),
  model: z.string(),
  mode: z.string(),
  resolution: z.string(),
  quality: z.string(),
  audio: z.literal("off"),
  batch: z.number().int().positive()
});

export const ShotCastSchema = z.object({
  id: z.string(),
  behavior: z.enum(["acting", "reacting"]),
  screenPosition: z.string()
});

export const ShotPropSchema = z.object({
  id: z.string(),
  count: z.number().int().nonnegative(),
  position: z.string(),
  startState: z.string(),
  endState: z.string(),
  mayMove: z.boolean()
});

export const ShotSpecSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  kind: z.enum(["generated", "hybrid", "editor"]),
  seconds: z.number().positive(),
  singleAction: z.string().min(1),
  cast: z.array(ShotCastSchema),
  props: z.array(ShotPropSchema),
  camera: z.object({
    axis: z.string(),
    framing: z.string(),
    motion: z.string()
  }),
  startState: z.string(),
  endState: z.string(),
  editorOverlays: z.array(z.string()),
  referenceKeys: z.array(z.string()),
  passCriteria: z.array(z.string()).min(1)
});

export const ShotManifestSchema = z.object({
  episodeId: z.string(),
  format: z.object({
    aspectRatio: z.string(),
    targetDurationSeconds: z.number().positive(),
    silentFirst: z.literal(true),
    generatedMusic: z.literal(false),
    intelligibleGeneratedDialogue: z.literal(false)
  }),
  location: z.object({
    id: z.string(),
    masterStatus: z.literal("locked"),
    master: z.string(),
    layoutLocked: z.literal(true)
  }),
  references: z.record(z.string(), z.string()),
  testSettings: ProviderSettingsSchema,
  finalSettings: ProviderSettingsSchema,
  shots: z.array(ShotSpecSchema).min(1),
  loop: z.object({
    method: z.literal("duplicate-opening-frames"),
    frames: z.number().int().positive()
  })
});

export type ProviderSettings = z.infer<typeof ProviderSettingsSchema>;
export type ShotManifest = z.infer<typeof ShotManifestSchema>;
export type ShotSpec = z.infer<typeof ShotSpecSchema>;
