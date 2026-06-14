import type { AxiosResponse } from "axios";
import { afterEach, describe, expect, test, vi } from "vitest";

import apiClient from "../api/apiClient";
import {
  createApplication,
  deleteApplication,
  updateApplication,
} from "../api/applicationsApi";
import type { UpdateApplicationRequest } from "../types/application";

describe("Application API", () => {
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

  test("createApplicationは申請作成APIを呼び出すこと", async () => {
    const postSpy = vi
      .spyOn(apiClient, "post")
      .mockResolvedValue({} as AxiosResponse);

    const request = {
      title: "新規申請タイトル",
      content: "新規申請内容",
      approverUserId: 2,
    };

    await createApplication(request);

    // createApplication関数が正しいエンドポイントとリクエストボディでAPIを呼び出していることを検証
    expect(postSpy).toHaveBeenCalledWith("/applications", request);
  });
});
