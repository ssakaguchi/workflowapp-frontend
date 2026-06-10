import {
  Box,
  Button,
  Pagination,
  type SelectChangeEvent,
  Stack,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";

import { deleteApplication, getApplications } from "../api/applicationsApi";
import ApplicationDeleteConfirmDialog from "../components/applications/ApplicationDeleteConfirmDialog";
import { ApplicationListTable } from "../components/applications/ApplicationListTable";
import ApplicationStatusFilter from "../components/applications/ApplicationStatusFilter";
import type { ApplicationListItem, StatusFilter } from "../types/application";

export function ApplicationListPage() {
  const PAGE_SIZE = 10;

  const [page, setPage] = useState(1);
  const [applications, setApplications] = useState<ApplicationListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [deleteTargetApplication, setDeleteTargetApplication] =
    useState<ApplicationListItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<StatusFilter>("All");
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setErrorMessage("");
        const response = await getApplications(page, PAGE_SIZE, selectedStatus);
        setApplications(response.items);
        setTotalPages(response.totalPages);
      } catch {
        setErrorMessage("申請一覧の取得に失敗しました。");
      } finally {
        setIsLoading(false);
      }
    };

    fetchApplications();
  }, [page, PAGE_SIZE, selectedStatus]);

  const handleDeleteClick = (application: ApplicationListItem) => {
    setDeleteTargetApplication(application);
  };

  // 申請削除の確定処理
  const handleDeleteConfirm = async () => {
    if (deleteTargetApplication === null || isDeleting) {
      return;
    }

    // エラーメッセージをリセット
    setErrorMessage("");
    setIsDeleting(true);

    // idが数値でない場合は処理を中断
    if (!Number.isFinite(deleteTargetApplication.id)) {
      setErrorMessage("削除対象の申請IDが不正です。");
      return;
    }

    try {
      await deleteApplication(deleteTargetApplication.id);

      setApplications((current) =>
        current.filter((app) => app.id !== deleteTargetApplication.id),
      );
    } catch {
      setErrorMessage("申請の削除に失敗しました。");
    } finally {
      setIsDeleting(false);
      setDeleteTargetApplication(null);
    }
  };

  const handleDeleteCancel = () => {
    setIsDeleting(false);
    setDeleteTargetApplication(null);
  };

  const handleStatusChange = (event: SelectChangeEvent<string>) => {
    setSelectedStatus(event.target.value as StatusFilter);
    setPage(1);
  };

  return (
    <div>
      <Box sx={{ p: 3 }}>
        <Typography variant="h5" component="h1">
          申請一覧
        </Typography>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mb: 2 }}
        >
          {/* ステータスフィルタのセレクトボックス */}
          <ApplicationStatusFilter
            selectedStatus={selectedStatus}
            handleStatusChange={handleStatusChange}
          />

          <Button
            variant="contained"
            component={RouterLink}
            to="/applications/new"
          >
            新規作成
          </Button>
        </Stack>
      </Box>
      {isLoading && <Typography>読み込み中...</Typography>}
      {!isLoading && errorMessage && <Typography>{errorMessage}</Typography>}
      {!isLoading && !errorMessage && applications.length === 0 && (
        <Typography>
          {selectedStatus === "All"
            ? "申請データがありません。"
            : "該当する申請データがありません。"}
        </Typography>
      )}
      {/* フィルタリング後のデータがある場合のテーブル表示 */}
      {!isLoading && applications.length > 0 && (
        <ApplicationListTable
          applications={applications}
          onDelete={handleDeleteClick}
        />
      )}
      {/* ページネーションの表示は、totalPagesが1より大きい場合に限定する */}
      {totalPages > 1 && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(_, value) => setPage(value)}
            color="primary"
          />
        </Box>
      )}

      {/* 削除確認ダイアログ */}
      <ApplicationDeleteConfirmDialog
        deleteTargetApplication={deleteTargetApplication}
        isDeleting={isDeleting}
        handleDeleteCancel={handleDeleteCancel}
        handleDeleteConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
