import { z } from "zod";

export const sustainabilitySectionSchema = z.object({
  headline: z.string().min(1),
  bodyText: z.string().min(1),
  imageUrl: z.string().min(1),
  imageAlt: z.string().min(1),
});

export const sustainabilityItemSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  iconName: z.string().min(1),
  order: z.number().int().default(0),
});
