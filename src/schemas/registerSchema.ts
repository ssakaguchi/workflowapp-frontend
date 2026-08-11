import { z } from "zod";

export const registerSchema = z.object({
  loginId: z
    .string()
    .refine((value) => value.trim().length > 0, {
      message: "ログインIDを入力してください。",
    })
    .refine((value) => value.length > 3, {
      message: "ログインIDは3文字以上で入力してください。",
    }),

  displayName: z
    .string()
    .refine((value) => value.trim().length > 0, {
      message: "表示名を入力してください。",
    })
    .refine((value) => value.length <= 20, {
      message: "表示名は20文字以内で入力してください。",
    }),

  password: z
    .string()
    .refine((value) => value.trim().length > 0, {
      message: "パスワードを入力してください。",
    })
    .refine((value) => value.length >= 8, {
      message: "パスワードは8文字以上で入力してください。",
    })
    .refine((value) => /^(?=.*[A-Za-z])(?=.*\d).+$/.test(value), {
      message: "パスワードは英字と数字を含めてください。",
    }),
});

export type RegisterFormValues = z.infer<typeof registerSchema>;
