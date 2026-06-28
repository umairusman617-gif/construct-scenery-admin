import { z } from "zod";

export const processStepSchema = z.object({
  number: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  order: z.number().int().default(0),
});
