import { z } from "zod";

const statSchema = z.object({ value: z.string(), label: z.string() });
const pillarSchema = z.object({ title: z.string(), description: z.string() });

export const aboutSchema = z.object({
  headline: z.string().min(1),
  bodyText: z.string().min(1),
  imageUrl: z.string().min(1),
  imageAlt: z.string().min(1),
  stats: z.array(statSchema).min(1),
  pillars: z.array(pillarSchema).min(1),
});
