import { afterEach, describe, expect, test, vi } from "vitest";
import apiClient from "../api/apiClient";
import { deleteApplication } from "../api/applicationsApi";
import type { AxiosResponse } from "axios";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("deleteApplication", () => {
  test("指定したIDの申請削除APIを呼び出すこと", async () => {
    const deleteSpy = vi
      .spyOn(apiClient, "delete")
      .mockResolvedValue({} as AxiosResponse);

    await deleteApplication(1);

    // deleteApplication関数が正しいエンドポイントでAPIを呼び出していることを検証
    expect(deleteSpy).toHaveBeenCalledWith("/applications/1");
  });
});
