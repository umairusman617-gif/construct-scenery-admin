import { z } from "zod";

export const testimonialSchema = z.object({
  text: z.string().min(1),
  name: z.string().min(1),
  role: z.string().min(1),
  imageUrl: z.string().min(1),
  order: z.number().int().default(0),
  visible: z.boolean().default(true),
});
