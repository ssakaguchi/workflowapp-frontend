import { beforeEach, describe, expect, test } from "vitest";

import { applicationDraftStorage } from "../utils/applicationDraftStorage";

describe("applicationDraftStorage", () => {
  beforeEach(() => {
    localStorage.removeItem("applicationDraft");
  });

  test("下書きを保存して取得できること", () => {
    applicationDraftStorage.set({
      title: "出張申請",
      content: "東京への出張を申請します。",
    });

    expect(applicationDraftStorage.get()).toEqual({
      title: "出張申請",
      content: "東京への出張を申請します。",
    });
  });

  test("下書きが保存されていない場合は空の初期値を返すこと", () => {
    expect(applicationDraftStorage.get()).toEqual({
      title: "",
      content: "",
      approverUserId: undefined,
    });
  });

  test("不正なJSONが保存されている場合は空の初期値を返すこと", () => {
    localStorage.setItem("applicationDraft", "{ invalid json");

    expect(applicationDraftStorage.get()).toEqual({
      title: "",
      content: "",
      approverUserId: undefined,
    });
  });

  test("保存した下書きを削除できること", () => {
    applicationDraftStorage.set({
      title: "出張申請",
      content: "東京への出張を申請します。",
    });

    applicationDraftStorage.remove();

    expect(localStorage.getItem("applicationDraft")).toBeNull();
  });
});
