import { beforeEach, describe, expect, test } from "vitest";

import { applicationStatusFilterStorage } from "../utils/applicationStatusFilterStorage";

describe("applicationStatusFilterStorage", () => {
  beforeEach(() => {
    localStorage.removeItem("applicationStatusFilter");
  });

  test("ステータスを保存して取得できること", () => {
    applicationStatusFilterStorage.set("Pending");

    expect(applicationStatusFilterStorage.get()).toBe("Pending");
  });

  test("保存値がない場合はAllを返すこと", () => {
    expect(applicationStatusFilterStorage.get()).toBe("All");
  });

  test("不正な値が保存されている場合はAllを返すこと", () => {
    localStorage.setItem("applicationStatusFilter", "Unknown");

    expect(applicationStatusFilterStorage.get()).toBe("All");
  });

  test("保存したステータスを削除できること", () => {
    applicationStatusFilterStorage.set("Approved");

    applicationStatusFilterStorage.remove();

    expect(localStorage.getItem("applicationStatusFilter")).toBeNull();
  });
});
