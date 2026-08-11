import { z } from "zod";

export const applicationCreateSchema = z.object({
  title: z.string().trim().min(1, "タイトルを入力してください。"),
  content: z.string().trim().min(1, "内容を入力してください。"),
  approverUserId: z
    .number({
      error: "承認者を選択してください。",
    })
    .int()
    .positive("承認者を選択してください。"),
});

export type ApplicationCreateFormValues = z.infer<
  typeof applicationCreateSchema
>;
