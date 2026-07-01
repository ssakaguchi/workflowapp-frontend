import { useEffect, useState } from "react";

import {
  getAdminApplications,
  getApplications,
  getMyApprovalRequests,
} from "../api/applicationsApi";
import type {
  ApplicationListItem,
  ListView,
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
  const [isLoading, setIsLoading] = useState(true);
  const [fetchErrorMessage, setFetchErrorMessage] = useState("");
  const [operationErrorMessage, setOperationErrorMessage] = useState("");
  const [applications, setApplications] = useState<ApplicationListItem[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [role] = useState(() => roleStorage.get());
  const [page, setPage] = useState(1);
  const [selectedStatus, setSelectedStatus] = useState<StatusFilter>("All");
  const [listView, setListView] = useState<ListView>(() =>
    role === "Admin" ? "admin" : "myApplications",
  );

  // 申請一覧の取得処理
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setIsLoading(true);
        setFetchErrorMessage("");
        setOperationErrorMessage("");
        const response = await fetchApplicationList(
          listView,
          page,
          selectedStatus,
        );
        setApplications(response.items);
        setTotalPages(response.totalPages);
      } catch {
        setApplications([]);
        setTotalPages(0);
        setFetchErrorMessage("申請一覧の取得に失敗しました。");
      } finally {
        setIsLoading(false);
      }
    };

    fetchApplications();
  }, [page, selectedStatus, listView]);

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

  // 返却する値をオブジェクトとしてまとめる
  return {
    applications,
    isLoading,
    fetchErrorMessage,
    operationErrorMessage,
    selectedStatus,
    totalPages,
    listView,
    page,
    setPage,
    setOperationErrorMessage,
    setApplications,
    role,
    changeStatus,
    changeListView,
  };
}
