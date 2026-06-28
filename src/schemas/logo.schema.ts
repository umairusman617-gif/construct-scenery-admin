import { z } from "zod";

export const logoSchema = z.object({
  name: z.string().min(1),
  imageUrl: z.string().optional(),
  order: z.number().int().default(0),
  visible: z.boolean().default(true),
});

export const reorderSchema = z.object({
  ids: z.array(z.number().int()).min(1),
});
