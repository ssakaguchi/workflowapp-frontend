import { z } from "zod";

export const applicationDraftSchema = z.object({
  title: z.string(),
  content: z.string(),
  approverUserId: z.number().int().positive().optional(),
});

export type ApplicationDraft = z.infer<typeof applicationDraftSchema>;
