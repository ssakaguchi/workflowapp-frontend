import { describe, expect, test } from "vitest";

import { registerSchema } from "../schemas/registerSchema";

describe("registerSchema", () => {
  const validValues = {
    loginId: "applicant01",
    displayName: "テスト申請者",
    password: "password01",
  };

  test("すべての入力値が条件を満たす場合、検証に成功すること", () => {
    const result = registerSchema.safeParse(validValues);

    expect(result.success).toBe(true);
  });

  test("ログインIDが空白のみの場合、検証に失敗すること", () => {
    const result = registerSchema.safeParse({
      ...validValues,
      loginId: "   ",
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.flatten().fieldErrors.loginId?.[0]).toBe(
        "ログインIDを入力してください。",
      );
    }
  });

  test("ログインIDが3文字未満の場合、検証に失敗すること", () => {
    const result = registerSchema.safeParse({
      ...validValues,
      loginId: "abc",
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.flatten().fieldErrors.loginId?.[0]).toBe(
        "ログインIDは3文字以上で入力してください。",
      );
    }
  });

  test("表示名が20文字を超える場合、検証に失敗すること", () => {
    const result = registerSchema.safeParse({
      ...validValues,
      displayName: "あ".repeat(21),
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.flatten().fieldErrors.displayName?.[0]).toBe(
        "表示名は20文字以内で入力してください。",
      );
    }
  });

  test("パスワードが8文字未満の場合、検証に失敗すること", () => {
    const result = registerSchema.safeParse({
      ...validValues,
      password: "pass01",
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.flatten().fieldErrors.password?.[0]).toBe(
        "パスワードは8文字以上で入力してください。",
      );
    }
  });

  test("パスワードに数字が含まれていない場合、検証に失敗すること", () => {
    const result = registerSchema.safeParse({
      ...validValues,
      password: "password",
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.flatten().fieldErrors.password?.[0]).toBe(
        "パスワードは英字と数字を含めてください。",
      );
    }
  });

  test("表示名が空白のみの場合、検証に失敗すること", () => {
    const result = registerSchema.safeParse({
      ...validValues,
      displayName: "   ",
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.flatten().fieldErrors.displayName?.[0]).toBe(
        "表示名を入力してください。",
      );
    }
  });

  test("パスワードに英字が含まれていない場合、検証に失敗すること", () => {
    const result = registerSchema.safeParse({
      ...validValues,
      password: "12345678",
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.flatten().fieldErrors.password?.[0]).toBe(
        "パスワードは英字と数字を含めてください。",
      );
    }
  });
});
