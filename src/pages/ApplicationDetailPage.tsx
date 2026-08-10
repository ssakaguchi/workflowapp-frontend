import { Alert, Button, Container, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import ApplicationDetailInfo from "../components/applications/ApplicationDetailInfo";
import ApplicationStatusConfirmDialog from "../components/applications/ApplicationStatusConfirmDialog";
import ApprovalActionButtons from "../components/applications/ApprovalActionButtons";
import ApprovalRouteTable from "../components/applications/ApprovalRouteTable";
import useApplicationDetail from "../hooks/useApplicationDetail";
import useUpdateApplicationStatus from "../hooks/useUpdateApplicationStatus";
import { queryClient } from "../lib/queryClient";
import { getCurrentUser } from "../services/authService";
import type { CurrentUser } from "../types/auth";
import { roleStorage } from "../utils/roleStorage";
import { tokenStorage } from "../utils/tokenStorage";

export default function ApplicationDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { application, isLoading, errorMessage } = useApplicationDetail(id);
  const [statusUpdateError, setStatusUpdateError] = useState("");
  const [statusUpdateMessage, setStatusUpdateMessage] = useState("");

  const [statusConfirmOpen, setStatusConfirmOpen] = useState(false);
  const [nextStatus, setNextStatus] = useState<"Approved" | "Rejected" | null>(
    null,
  );

  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const approvalSteps = application?.approvalSteps ?? [];

  const currentPendingApprovalStep = approvalSteps
    .filter((step) => step.status === "Pending")
    .sort((a, b) => a.stepOrder - b.stepOrder)[0];

  // 申請のステータスが「Pending」で、かつユーザーのロールが「Approver」、
  // かつ現在の承認ステップの承認者IDがユーザーIDと一致する場合にステータス更新ボタンを表示
  const canUpdateStatus =
    application?.status === "Pending" &&
    currentUser?.role === "Approver" &&
    currentPendingApprovalStep?.approverUserId === currentUser.userId;

  const updateApplicationStatusMutation = useUpdateApplicationStatus();

  // 画面表示時にユーザーロールを取得して状態にセットする
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const currentUser = await getCurrentUser();
        setCurrentUser(currentUser);
        roleStorage.set(currentUser.role);
      } catch {
        tokenStorage.remove();
        roleStorage.remove();
        queryClient.clear();
        navigate("/login");
      }
    };

    fetchCurrentUser();
  }, [navigate]);

  // ステータス更新の確認ダイアログを開く関数
  const handleOpenStatusConfirm = (status: "Approved" | "Rejected") => {
    setNextStatus(status);
    setStatusConfirmOpen(true);
  };

  // ステータス更新を実行する関数
  const handleConfirmStatusUpdate = async () => {
    if (updateApplicationStatusMutation.isPending) {
      return;
    }
    if (!application || !nextStatus) {
      return;
    }

    setStatusUpdateError("");
    setStatusUpdateMessage("");

    try {
      await updateApplicationStatusMutation.mutateAsync({
        applicationId: application.id,
        status: nextStatus,
      });

      setStatusUpdateMessage("ステータスを更新しました。");
      setStatusConfirmOpen(false);
      setNextStatus(null);
    } catch {
      setStatusUpdateError("ステータスの更新に失敗しました。");
    }
  };

  // 編集ボタンの表示条件を判定する
  const canEdit =
    application?.applicantUserId === currentUser?.userId &&
    application?.status === "Pending" &&
    currentUser?.role !== "Admin";

  return (
    <Container>
      <Typography variant="h5" component="h1" gutterBottom>
        申請詳細画面
      </Typography>
      <Stack
        direction="row"
        spacing={1}
        sx={{ mb: 2 }}
        justifyContent="flex-end"
      >
        <Button
          type="button"
          variant="outlined"
          onClick={() => navigate("/applications")}
        >
          一覧へ戻る
        </Button>

        {canEdit && (
          <Button
            type="button"
            variant="outlined"
            onClick={() => {
              if (id) {
                navigate(`/applications/${id}/edit`);
              }
            }}
          >
            編集
          </Button>
        )}
      </Stack>

      {isLoading && <p>読み込み中...</p>}
      {!isLoading && errorMessage && <p>{errorMessage}</p>}

      {!isLoading && !errorMessage && application && (
        <>
          <ApplicationDetailInfo application={application} />

          {canUpdateStatus && (
            <ApprovalActionButtons
              onOpenStatusConfirm={handleOpenStatusConfirm}
              isStatusUpdating={updateApplicationStatusMutation.isPending}
            />
          )}

          {/* 承認ルートの表示 */}
          <ApprovalRouteTable approvalSteps={approvalSteps} />
        </>
      )}
      {/* ステータス更新の確認ダイアログ */}
      <ApplicationStatusConfirmDialog
        open={statusConfirmOpen}
        nextStatus={nextStatus}
        isStatusUpdating={updateApplicationStatusMutation.isPending}
        onClose={() => setStatusConfirmOpen(false)}
        onConfirm={handleConfirmStatusUpdate}
      />
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
