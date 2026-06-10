import { Alert, Button, Container, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { getApplicationById } from "../api/applicationsApi";
import { updateApplicationStatus } from "../api/applicationsApi";
import ApprovalActionButtons from "../components/applications/ApprovalActionButtons";
import ApplicationDetailInfo from "../components/applications/ApplicationDetailInfo";
import ApplicationStatusConfirmDialog from "../components/applications/ApplicationStatusConfirmDialog";
import ApprovalRouteTable from "../components/applications/ApprovalRouteTable";
import { getCurrentUser } from "../services/authService";
import type { ApplicationDetail } from "../types/application";
import type { UserRole } from "../types/auth";
import { roleStorage } from "../utils/roleStorage";
import { tokenStorage } from "../utils/tokenStorage";

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
  const [role, setRole] = useState<UserRole | null>(() => roleStorage.get());
  const isApprover = role === "Approver";
  const approvalSteps = application?.approvalSteps ?? [];

  // 画面表示時に申請の詳細を取得する
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

  // 画面表示時にユーザーロールを取得して状態にセットする
  useEffect(() => {
    const fetchRoleIfNeeded = async () => {
      if (role) {
        return;
      }

      try {
        const currentUser = await getCurrentUser();
        roleStorage.set(currentUser.role);
        setRole(currentUser.role);
      } catch {
        tokenStorage.remove();
        roleStorage.remove();
        navigate("/login");
      }
    };

    fetchRoleIfNeeded();
  }, [role, navigate]);

  // ステータス更新の確認ダイアログを開く関数
  const handleOpenStatusConfirm = (status: "Approved" | "Rejected") => {
    setNextStatus(status);
    setStatusConfirmOpen(true);
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
      </Stack>

      {isLoading && <p>読み込み中...</p>}
      {!isLoading && errorMessage && <p>{errorMessage}</p>}

      {!isLoading && !errorMessage && application && (
        <>
          <ApplicationDetailInfo application={application} />

          {application.status === "Pending" && isApprover && (
            <ApprovalActionButtons
              onOpenStatusConfirm={handleOpenStatusConfirm}
              isStatusUpdating={isStatusUpdating}
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
        isStatusUpdating={isStatusUpdating}
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
