import { z } from "zod";
import { VisualReferenceSchema } from "../references/schemas.ts";

export const CommonAssetManifestSchema = z.object({
  schemaVersion: z.literal(1),
  id: z.string().min(1).regex(/^[a-z0-9-]+$/),
  name: z.string().min(1),
  category: z.enum(["environment", "prop", "style", "token"]),
  purpose: z.string().min(1),
  lockedDesign: z.array(z.string().min(1)).min(1),
  status: z.enum(["draft", "approved-for-package-development"]),
  visualReferences: z.array(VisualReferenceSchema).min(1)
});

export const CommonAssetCatalogSchema = z.object({
  schemaVersion: z.literal(1),
  assets: z.array(z.object({
    id: z.string().min(1).regex(/^[a-z0-9-]+$/),
    category: z.enum(["environment", "prop", "style", "token"]),
    manifest: z.string().min(1)
  })).min(1)
}).superRefine((catalog, context) => {
  const ids = new Set<string>();
  for (const asset of catalog.assets) {
    if (ids.has(asset.id)) {
      context.addIssue({
        code: "custom",
        message: `Duplicate common asset ID: ${asset.id}`,
        path: ["assets"]
      });
    }
    ids.add(asset.id);
  }
});

export type CommonAssetCatalog = z.infer<typeof CommonAssetCatalogSchema>;
export type CommonAssetManifest = z.infer<typeof CommonAssetManifestSchema>;
