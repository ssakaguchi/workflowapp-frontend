import { afterEach, describe, expect, test, vi } from "vitest";
import apiClient from "../api/apiClient";
import { deleteApplication, updateApplication } from "../api/applicationsApi";
import type { AxiosResponse } from "axios";
import type { UpdateApplicationRequest } from "../types/application";

describe("deleteApplication", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  test("updateApplicationは指定したIDの申請更新APIを呼び出すこと", async () => {
    const putSpy = vi
      .spyOn(apiClient, "put")
      .mockResolvedValue({} as AxiosResponse);

    const request: UpdateApplicationRequest = {
      title: "更新後タイトル",
      content: "更新後内容",
    };

    await updateApplication(1, request);

    // updateApplication関数が正しいエンドポイントとリクエストボディでAPIを呼び出していることを検証
    expect(putSpy).toHaveBeenCalledWith("/applications/1", request);
  });

  test("指定したIDの申請削除APIを呼び出すこと", async () => {
    const deleteSpy = vi
      .spyOn(apiClient, "delete")
      .mockResolvedValue({} as AxiosResponse);

    await deleteApplication(1);

    // deleteApplication関数が正しいエンドポイントでAPIを呼び出していることを検証
    expect(deleteSpy).toHaveBeenCalledWith("/applications/1");
  });
});
