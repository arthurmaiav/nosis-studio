import { z } from "zod";

export const VisualReferenceSchema = z.object({
  id: z.string().min(1).regex(/^[a-z0-9-]+$/),
  kind: z.enum([
    "environment-master",
    "expression-sheet",
    "master-sheet",
    "pose-sheet",
    "prop-sheet",
    "state-sheet",
    "style-master",
    "token-sheet"
  ]),
  path: z.string().min(1),
  status: z.enum(["approved", "pending", "rejected"]),
  distribution: z.enum(["public", "local-only"]),
  coverage: z.array(z.string().min(1))
});

export type VisualReference = z.infer<typeof VisualReferenceSchema>;
