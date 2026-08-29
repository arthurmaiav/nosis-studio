import { z } from "zod";

const IdSchema = z.string().min(1).regex(/^[a-z0-9-]+$/);

export const VisualModeSchema = z.enum(["2d", "3d"]);

export const MasterSheetCoverageSchema = z.array(z.enum([
  "front",
  "three-quarter",
  "side",
  "back",
  "five-expressions",
  "signature-role-prop",
  "neutral-background"
])).length(7).superRefine((coverage, context) => {
  if (new Set(coverage).size !== coverage.length) {
    context.addIssue({
      code: "custom",
      message: "Master sheet coverage entries must be unique"
    });
  }
});

export const CharacterMasterSchema = z.discriminatedUnion("status", [
  z.object({
    status: z.literal("missing")
  }),
  z.object({
    path: z.string().min(1),
    status: z.enum(["pending", "approved"]),
    distribution: z.enum(["public", "local-only"]),
    coverage: MasterSheetCoverageSchema
  })
]);

export const CharacterManifestSchema = z.object({
  schemaVersion: z.literal(2),
  id: IdSchema,
  name: z.string().min(1),
  roster: z.enum(["core", "backlog"]),
  archiveRole: z.string().min(1),
  storyFunction: z.string().min(1),
  lockedDesign: z.array(z.string().min(1)).min(1),
  roleProp: z.string().min(1),
  expressions: z.array(z.string().min(1)).length(5),
  masters: z.object({
    "2d": CharacterMasterSchema,
    "3d": CharacterMasterSchema
  })
});

export const CharacterCatalogSchema = z.object({
  schemaVersion: z.literal(1),
  sourceArchive: z.url(),
  characters: z.array(z.object({
    id: z.string().min(1).regex(/^[a-z0-9-]+$/),
    manifest: z.string().min(1)
  })).min(1)
}).superRefine((catalog, context) => {
  const ids = new Set<string>();
  for (const character of catalog.characters) {
    if (ids.has(character.id)) {
      context.addIssue({
        code: "custom",
        message: `Duplicate character ID: ${character.id}`,
        path: ["characters"]
      });
    }
    ids.add(character.id);
  }
});

export type CharacterCatalog = z.infer<typeof CharacterCatalogSchema>;
export type CharacterManifest = z.infer<typeof CharacterManifestSchema>;
export type CharacterMaster = z.infer<typeof CharacterMasterSchema>;
export type AvailableCharacterMaster = Exclude<CharacterMaster, { status: "missing" }>;
export type VisualMode = z.infer<typeof VisualModeSchema>;
