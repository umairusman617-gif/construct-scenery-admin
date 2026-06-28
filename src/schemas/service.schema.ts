import { z } from "zod";

export const serviceSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  iconName: z.string().min(1),
  order: z.number().int().default(0),
  visible: z.boolean().default(true),
});
