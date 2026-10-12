import { beforeEach, describe, expect, test } from "vitest";

import { applicationListViewStorage } from "../utils/applicationListViewStorage";

describe("applicationListViewStorage", () => {
  beforeEach(() => {
    localStorage.removeItem("applicationListView");
  });

  test("一覧タブを保存して取得できること", () => {
    applicationListViewStorage.set("approvalRequests");

    expect(applicationListViewStorage.get()).toBe("approvalRequests");
  });

  test("保存値がない場合はnullを返すこと", () => {
    expect(applicationListViewStorage.get()).toBeNull();
  });

  test("不正な値が保存されている場合はnullを返すこと", () => {
    localStorage.setItem("applicationListView", "unknown");

    expect(applicationListViewStorage.get()).toBeNull();
  });

  test("保存した一覧タブを削除できること", () => {
    applicationListViewStorage.set("myApplications");

    applicationListViewStorage.remove();

    expect(localStorage.getItem("applicationListView")).toBeNull();
  });
});
