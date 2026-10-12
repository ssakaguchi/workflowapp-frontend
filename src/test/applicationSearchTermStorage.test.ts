import { beforeEach, describe, expect, test } from "vitest";

import { applicationSearchTermStorage } from "../utils/applicationSearchTermStorage";

describe("applicationSearchTermStorage", () => {
  beforeEach(() => {
    localStorage.removeItem("applicationSearchTerm");
  });

  test("検索語を保存して取得できること", () => {
    applicationSearchTermStorage.set("Travel");

    expect(applicationSearchTermStorage.get()).toBe("Travel");
  });

  test("検索語が保存されていない場合は空文字を返すこと", () => {
    expect(applicationSearchTermStorage.get()).toBe("");
  });

  test("保存した検索語を削除できること", () => {
    applicationSearchTermStorage.set("Travel");

    applicationSearchTermStorage.remove();

    expect(localStorage.getItem("applicationSearchTerm")).toBeNull();
  });

  test("空文字も保存できること", () => {
    applicationSearchTermStorage.set("");

    expect(applicationSearchTermStorage.get()).toBe("");
  });
});
