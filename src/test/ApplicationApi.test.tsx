import type { AxiosResponse } from "axios";
import { afterEach, describe, expect, test, vi } from "vitest";

import apiClient from "../api/apiClient";
import {
  createApplication,
  deleteApplication,
  getAdminApplications,
  getApplications,
  getMyApprovalRequests,
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

  test("getAdminApplicationsは管理者用申請一覧APIを呼び出すこと", async () => {
    const getSpy = vi.spyOn(apiClient, "get").mockResolvedValue({
      data: {
        items: [],
        totalCount: 0,
        page: 1,
        pageSize: 10,
        totalPages: 0,
      },
    } as AxiosResponse);

    await getAdminApplications(1, 10);

    expect(getSpy).toHaveBeenCalledWith("/applications/admin", {
      params: {
        page: 1,
        pageSize: 10,
      },
    });
  });

  test("各申請一覧APIは検索語をquery paramsへ含めること", async () => {
    const getSpy = vi.spyOn(apiClient, "get").mockResolvedValue({
      data: {
        items: [],
        totalCount: 0,
        page: 1,
        pageSize: 10,
        totalPages: 0,
      },
    } as AxiosResponse);

    await getApplications(1, 10, "Pending", "Mika");
    await getMyApprovalRequests(1, 10, "Mika");
    await getAdminApplications(1, 10, "Mika");

    expect(getSpy).toHaveBeenNthCalledWith(1, "/applications", {
      params: {
        page: 1,
        pageSize: 10,
        status: "Pending",
        searchTerm: "Mika",
      },
    });
    expect(getSpy).toHaveBeenNthCalledWith(
      2,
      "/applications/my-approval-requests",
      {
        params: {
          page: 1,
          pageSize: 10,
          searchTerm: "Mika",
        },
      },
    );
    expect(getSpy).toHaveBeenNthCalledWith(3, "/applications/admin", {
      params: {
        page: 1,
        pageSize: 10,
        searchTerm: "Mika",
      },
    });
  });
});
