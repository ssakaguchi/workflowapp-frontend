import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

type StatusUpdateConfirmDialogProps = {
  open: boolean;
  nextStatus: "Approved" | "Rejected" | null;
  isStatusUpdating: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

// 申請のステータス更新の確認ダイアログコンポーネント
const ApplicationStatusConfirmDialog = ({
  open,
  nextStatus,
  isStatusUpdating,
  onClose,
  onConfirm,
}: StatusUpdateConfirmDialogProps) => {
  return (
    <Dialog open={open} onClose={onClose}>
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
        <Button onClick={onClose} disabled={isStatusUpdating}>
          キャンセル
        </Button>

        <Button
          onClick={onConfirm}
          color={nextStatus === "Approved" ? "success" : "error"}
          variant="contained"
          disabled={isStatusUpdating}
        >
          {isStatusUpdating ? "更新中..." : "実行する"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ApplicationStatusConfirmDialog;
