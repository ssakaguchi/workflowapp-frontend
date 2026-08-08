import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import {
  getAdminApplications,
  getApplications,
  getMyApprovalRequests,
} from "../api/applicationsApi";
import { applicationQueryKeys } from "../queries/applicationQueryKeys";
import type {
  ApplicationListItem,
  ListView,
  PagedResponse,
  StatusFilter,
} from "../types/application";
import { roleStorage } from "../utils/roleStorage";

const PAGE_SIZE = 10;

const fetchApplicationList = async (
  listView: ListView,
  page: number,
  selectedStatus: StatusFilter,
) => {
  switch (listView) {
    case "admin":
      return getAdminApplications(page, PAGE_SIZE);
    case "approvalRequests":
      return getMyApprovalRequests(page, PAGE_SIZE);
    case "myApplications":
      return getApplications(page, PAGE_SIZE, selectedStatus);
    default: {
      const _exhaustive: never = listView;
      throw new Error(`Unsupported listView: ${_exhaustive}`);
    }
  }
};

// 申請一覧の取得処理をカスタムフックとして切り出す
export function useApplications() {
  const [operationErrorMessage, setOperationErrorMessage] = useState("");
  const [role] = useState(() => roleStorage.get());
  const [page, setPage] = useState(1);
  const [selectedStatus, setSelectedStatus] = useState<StatusFilter>("All");
  const [listView, setListView] = useState<ListView>(() =>
    role === "Admin" ? "admin" : "myApplications",
  );

  // 申請一覧の取得処理
  const queryClient = useQueryClient();
  const queryKey = applicationQueryKeys.list(listView, page, selectedStatus);
  const applicationQuery = useQuery({
    queryKey,
    queryFn: () => fetchApplicationList(listView, page, selectedStatus),
  });

  const applications = applicationQuery.data?.items ?? [];
  const totalPages = applicationQuery.data?.totalPages ?? 0;
  const fetchErrorMessage = applicationQuery.isError
    ? "申請一覧の取得に失敗しました。"
    : "";

  // ステータスフィルターの変更時の処理
  const changeStatus = (event: StatusFilter) => {
    setSelectedStatus(event);
    setPage(1);
  };

  // リストビューの変更時の処理
  const changeListView = (value: ListView) => {
    setListView(value);
    setPage(1);
    setSelectedStatus("All");
  };

  const clearOperationError = () => {
    setOperationErrorMessage("");
  };

  const showOperationError = (message: string) => {
    setOperationErrorMessage(message);
  };

  // 申請を削除した後に、キャッシュから削除する処理
  const removeApplication = (applicationId: number) => {
    queryClient.setQueriesData<PagedResponse<ApplicationListItem>>(
      { queryKey },
      (current) => {
        if (!current) {
          return current;
        }

        return {
          ...current,
          items: current.items.filter(
            (application) => application.id !== applicationId,
          ),
        };
      },
    );
  };

  // 返却する値をオブジェクトとしてまとめる
  return {
    applications,
    isLoading: applicationQuery.isLoading,
    fetchErrorMessage,
    operationErrorMessage,
    selectedStatus,
    totalPages,
    listView,
    page,
    setPage,
    role,
    changeStatus,
    changeListView,
    clearOperationError,
    showOperationError,
    removeApplication,
  };
}
