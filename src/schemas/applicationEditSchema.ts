import { z } from "zod";

export const applicationEditSchema = z.object({
  title: z.string().trim().min(1, "タイトルを入力してください。"),
  content: z.string().trim().min(1, "内容を入力してください。"),
});

export type ApplicationEditFormValues = z.infer<typeof applicationEditSchema>;
