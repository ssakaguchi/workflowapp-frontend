import { useNavigate, useParams } from "react-router-dom";
import type { ApplicationDetail } from "../types/application";
import { useEffect, useState } from "react";
import { getApplicationById } from "../api/applicationsApi";
import {
  Box,
  Button,
  Container,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Alert,
  Stack,
  Typography,
  Paper,
} from "@mui/material";
import { updateApplicationStatus } from "../api/applicationsApi";
import { formatDateTime } from "../utils/formatDateTime";

export default function ApplicationDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [application, setApplication] = useState<ApplicationDetail | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const [isStatusUpdating, setIsStatusUpdating] = useState(false);
  const [statusUpdateError, setStatusUpdateError] = useState("");
  const [statusUpdateMessage, setStatusUpdateMessage] = useState("");

  const [statusConfirmOpen, setStatusConfirmOpen] = useState(false);
  const [nextStatus, setNextStatus] = useState<"Approved" | "Rejected" | null>(
    null,
  );

  useEffect(() => {
    const fetchApplication = async () => {
      if (!id) {
        setErrorMessage("申請IDが見つかりません。");
        setIsLoading(false);
        return;
      }

      const applicationId = Number(id);

      if (isNaN(applicationId)) {
        setErrorMessage("申請IDが不正です。");
        setIsLoading(false);
        return;
      }

      try {
        const response = await getApplicationById(applicationId);
        setApplication(response);
      } catch {
        setErrorMessage("申請の詳細を取得できませんでした。");
      } finally {
        setIsLoading(false);
      }
    };

    fetchApplication();
  }, [id]);

  // ステータス更新の確認ダイアログを開く関数
  const handleOpenStatusConfirm = (status: "Approved" | "Rejected") => {
    setNextStatus(status);
    setStatusConfirmOpen(true);
  };

  // ステータスの表示ラベルを返す関数
  const statusLabel = (status: string) => {
    switch (status) {
      case "Pending":
        return "申請中";
      case "Approved":
        return "承認済み";
      case "Rejected":
        return "却下";
      default:
        return status;
    }
  };

  // ステータス更新を実行する関数
  const handleConfirmStatusUpdate = async () => {
    if (isStatusUpdating) {
      return;
    }
    if (!application || !nextStatus) {
      return;
    }

    setIsStatusUpdating(true);
    setStatusUpdateError("");
    setStatusUpdateMessage("");

    try {
      await updateApplicationStatus(application.id, nextStatus);

      // ステータス更新後は最新のステータスで画面を更新
      setApplication((current) =>
        current ? { ...current, status: nextStatus } : current,
      );

      setStatusUpdateMessage("ステータスを更新しました。");
      setStatusConfirmOpen(false);
      setNextStatus(null);
    } catch {
      setStatusUpdateError("ステータスの更新に失敗しました。");
    } finally {
      setIsStatusUpdating(false);
    }
  };

  return (
    <Container>
      <Typography variant="h5" component="h1" gutterBottom>
        申請詳細画面
      </Typography>

      <Stack direction="row" spacing={1} sx={{ mb: 2 }} justifyContent="right">
        <Button
          type="button"
          variant="outlined"
          onClick={() => navigate("/applications")}
        >
          一覧へ戻る
        </Button>

        <Button
          type="button"
          variant="outlined"
          onClick={() => {
            if (id) {
              navigate(`/applications/${id}/edit`);
            }
          }}
          style={{ marginLeft: "8px" }}
        >
          編集
        </Button>
      </Stack>
      {application?.status === "Pending" && (
        <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
          <Button
            variant="contained"
            color="success"
            onClick={() => handleOpenStatusConfirm("Approved")}
            disabled={isStatusUpdating}
          >
            承認
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => handleOpenStatusConfirm("Rejected")}
            disabled={isStatusUpdating}
          >
            却下
          </Button>
        </Box>
      )}
      {isLoading && <p>読み込み中...</p>}
      {!isLoading && errorMessage && <p>{errorMessage}</p>}
      {!isLoading && !errorMessage && application && (
        <Paper sx={{ p: 3 }}>
          <Stack spacing={2}>
            {/* <p>
              <strong>ID:</strong> {application.id}
            </p>
            <p>
              <strong>タイトル:</strong> {application.title}
            </p>
            <p>
              <strong>内容:</strong> {application.content}
            </p>
            <p>
              <strong>ステータス:</strong> {statusLabel(application.status)}
            </p>
            <p>
              <strong>作成日時:</strong> {formatDateTime(application.createdAt)}
            </p> */}

            <Typography>ID: {application.id}</Typography>
            <Typography>タイトル: {application.title}</Typography>
            <Typography>内容: {application.content}</Typography>
            <Typography>
              ステータス: {statusLabel(application.status)}
            </Typography>
            <Typography>
              作成日時: {formatDateTime(application.createdAt)}
            </Typography>
          </Stack>
        </Paper>
      )}

      {/* ステータス更新の確認ダイアログ */}
      <Dialog
        open={statusConfirmOpen}
        onClose={() => setStatusConfirmOpen(false)}
      >
        <DialogTitle>
          {nextStatus === "Approved"
            ? "申請を承認しますか？"
            : "申請を却下しますか？"}
        </DialogTitle>

        <DialogContent>
          <DialogContentText>
            {nextStatus === "Approved"
              ? "この申請を承認済みに変更します。よろしいですか？"
              : "この申請を却下します。よろしいですか？"}
          </DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button
            onClick={() => setStatusConfirmOpen(false)}
            disabled={isStatusUpdating}
          >
            キャンセル
          </Button>

          <Button
            onClick={handleConfirmStatusUpdate}
            color={nextStatus === "Approved" ? "success" : "error"}
            variant="contained"
            disabled={isStatusUpdating}
          >
            {isStatusUpdating ? "更新中..." : "実行する"}
          </Button>
        </DialogActions>
      </Dialog>
      {statusUpdateMessage && (
        <Alert severity="success" sx={{ mt: 2 }}>
          {statusUpdateMessage}
        </Alert>
      )}
      {statusUpdateError && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {statusUpdateError}
        </Alert>
      )}
    </Container>
  );
}
