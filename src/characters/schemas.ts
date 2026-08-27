import { z } from "zod";
import { VisualReferenceSchema, type VisualReference } from "../references/schemas.ts";

export { VisualReferenceSchema as CharacterVisualReferenceSchema };

export const CharacterManifestSchema = z.object({
  schemaVersion: z.literal(1),
  id: z.string().min(1).regex(/^[a-z0-9-]+$/),
  name: z.string().min(1),
  archiveRole: z.string().min(1),
  storyFunction: z.string().min(1),
  lockedDesign: z.array(z.string().min(1)).min(1),
  roleProp: z.string().min(1),
  expressions: z.array(z.string().min(1)).min(1),
  status: z.enum(["draft", "approved-for-package-development"]),
  visualReferences: z.array(VisualReferenceSchema).min(1)
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
export type CharacterVisualReference = VisualReference;
