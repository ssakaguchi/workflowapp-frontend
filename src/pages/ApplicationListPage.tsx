import {
  Box,
  Button,
  Pagination,
  type SelectChangeEvent,
  Stack,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import { type SyntheticEvent, useState } from "react";
import { Link as RouterLink } from "react-router-dom";

import { deleteApplication } from "../api/applicationsApi";
import ApplicationDeleteConfirmDialog from "../components/applications/ApplicationDeleteConfirmDialog";
import { ApplicationListTable } from "../components/applications/ApplicationListTable";
import ApplicationStatusFilter from "../components/applications/ApplicationStatusFilter";
import { useApplications } from "../hooks/useApplications";
import type {
  ApplicationListItem,
  ListView,
  StatusFilter,
} from "../types/application";

export function ApplicationListPage() {
  const {
    applications,
    isLoading,
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
  } = useApplications();

  const [deleteTargetApplication, setDeleteTargetApplication] =
    useState<ApplicationListItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteClick = (application: ApplicationListItem) => {
    setDeleteTargetApplication(application);
  };

  // 申請削除の確定処理
  const handleDeleteConfirm = async () => {
    if (deleteTargetApplication === null || isDeleting) {
      return;
    }

    // idが数値でない場合は処理を中断
    if (!Number.isFinite(deleteTargetApplication.id)) {
      showOperationError("削除対象の申請IDが不正です。");
      return;
    }

    // エラーメッセージをリセット
    clearOperationError();
    setIsDeleting(true);

    try {
      await deleteApplication(deleteTargetApplication.id);

      removeApplication(deleteTargetApplication.id);
    } catch {
      showOperationError("申請の削除に失敗しました。");
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
    changeStatus(event.target.value as StatusFilter);
  };

  const handleListViewChange = (_: SyntheticEvent, value: ListView) => {
    changeListView(value);
  };

  return (
    <div>
      <Box sx={{ p: 3 }}>
        <Typography variant="h5" component="h1">
          申請一覧
        </Typography>
        {role === "Applicant" && (
          <Tabs
            value={listView}
            onChange={handleListViewChange}
            sx={{ mt: 2, mb: 2 }}
          >
            <Tab label="自分の申請" value="myApplications" />
          </Tabs>
        )}
        {role === "Approver" && (
          <Tabs
            value={listView}
            onChange={handleListViewChange}
            sx={{ mt: 2, mb: 2 }}
          >
            <Tab label="自分の申請" value="myApplications" />
            <Tab label="承認待ち" value="approvalRequests" />
          </Tabs>
        )}
        {role === "Admin" && (
          <Tabs
            value={listView}
            onChange={handleListViewChange}
            sx={{ mt: 2, mb: 2 }}
          >
            <Tab label="管理者用" value="admin" />
          </Tabs>
        )}
        {listView === "myApplications" && (
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="flex-start"
            sx={{ mt: 2, mb: 4 }}
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
        )}
      </Box>
      {isLoading && <Typography>読み込み中...</Typography>}
      {!isLoading && fetchErrorMessage && (
        <Typography color="error" sx={{ mt: 2 }}>
          {fetchErrorMessage}
        </Typography>
      )}
      {!isLoading && operationErrorMessage && (
        <Typography color="error" sx={{ mt: 2 }}>
          {operationErrorMessage}
        </Typography>
      )}
      {!isLoading && !fetchErrorMessage && applications.length === 0 && (
        <Typography>
          {listView === "approvalRequests"
            ? "承認待ちの申請はありません。"
            : selectedStatus === "All"
              ? "申請データがありません。"
              : "該当する申請データがありません。"}
        </Typography>
      )}
      {/* フィルタリング後のデータがある場合のテーブル表示 */}
      {!isLoading && !fetchErrorMessage && applications.length > 0 && (
        <ApplicationListTable
          applications={applications}
          onDelete={
            listView === "myApplications" ? handleDeleteClick : undefined
          }
          showEdit={listView === "myApplications"}
          showDelete={listView === "myApplications"}
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
        open={deleteTargetApplication !== null}
        applicationTitle={deleteTargetApplication?.title}
        isDeleting={isDeleting}
        onCancel={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
