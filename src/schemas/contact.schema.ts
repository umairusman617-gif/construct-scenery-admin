import { z } from "zod";

export const contactSchema = z.object({
  headline: z.string().min(1),
  bodyText: z.string().min(1),
  cta1Label: z.string().min(1),
  cta1Email: z.string().email(),
  cta2Label: z.string().min(1),
  cta2Email: z.string().email(),
});
