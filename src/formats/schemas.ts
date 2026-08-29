import { z } from "zod";

const IdSchema = z.string().min(1).regex(/^[a-z0-9-]+$/);

export const FormatDefinitionSchema = z.object({
  schemaVersion: z.literal(1),
  id: IdSchema,
  name: z.string().min(1),
  delivery: z.enum(["single-image", "image-sequence", "video"]),
  unitName: z.enum(["panel", "slide", "shot"]),
  canvas: z.object({
    aspectRatio: z.string().regex(/^\d+:\d+$/),
    width: z.number().int().positive(),
    height: z.number().int().positive(),
    scope: z.enum(["delivery", "unit"])
  }),
  unitCount: z.object({
    min: z.number().int().positive(),
    max: z.number().int().positive()
  }).refine((count) => count.max >= count.min, {
    message: "Maximum unit count must be greater than or equal to minimum unit count"
  }),
  lettering: z.enum(["post-lettered", "generated", "none"]),
  rules: z.array(z.string().min(1)).min(1)
});

export const FormatCatalogSchema = z.object({
  schemaVersion: z.literal(1),
  formats: z.array(z.object({
    id: IdSchema,
    manifest: z.string().min(1)
  })).min(1)
}).superRefine((catalog, context) => {
  const ids = new Set<string>();
  for (const format of catalog.formats) {
    if (ids.has(format.id)) {
      context.addIssue({
        code: "custom",
        message: `Duplicate format ID: ${format.id}`,
        path: ["formats"]
      });
    }
    ids.add(format.id);
  }
});

export type FormatCatalog = z.infer<typeof FormatCatalogSchema>;
export type FormatDefinition = z.infer<typeof FormatDefinitionSchema>;
