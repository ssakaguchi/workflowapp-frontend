import { useEffect, useState } from "react";
import { deleteApplication, getApplications } from "../api/applicationsApi";
import type { ApplicationListItem } from "../types/application";
import { ApplicationListTable } from "../components/applications/ApplicationListTable";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

export function ApplicationListPage() {
  const [applications, setApplications] = useState<ApplicationListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [deleteTargetApplication, setDeleteTargetApplication] =
    useState<ApplicationListItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await getApplications();
        setApplications(response);
      } catch {
        setErrorMessage("申請一覧の取得に失敗しました。");
      } finally {
        setIsLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const handleDeleteClick = (application: ApplicationListItem) => {
    setDeleteTargetApplication(application);
  };

  const handleDeleteConfirm = async () => {
    // エラーメッセージをリセット
    setErrorMessage("");
    setIsDeleting(true);

    if (deleteTargetApplication === null || isDeleting) {
      return;
    }

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

  return (
    <div>
      <h2>申請一覧</h2>
      <Button component={RouterLink} to="/applications/new">
        新規作成
      </Button>

      {isLoading && <p>読み込み中...</p>}

      {!isLoading && errorMessage && <p>{errorMessage}</p>}

      {!isLoading && !errorMessage && applications.length === 0 && (
        <p>申請データがありません。</p>
      )}

      {!isLoading && applications.length > 0 && (
        <ApplicationListTable
          applications={applications}
          onDelete={handleDeleteClick}
        />
      )}

      <Dialog
        open={deleteTargetApplication !== null}
        onClose={handleDeleteCancel}
      >
        <DialogTitle>申請を削除しますか？</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {deleteTargetApplication
              ? `「${deleteTargetApplication.title}」を削除してもよろしいですか？`
              : ""}
          </DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleDeleteCancel} disabled={isDeleting}>
            キャンセル
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            disabled={isDeleting}
          >
            削除する
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
