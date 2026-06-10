import type { DialogProps } from "@mui/material";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

type ApplicationDeleteConfirmDialogProps = {
  open: boolean;
  applicationTitle?: string;
  isDeleting: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

// 申請削除の確認ダイアログコンポーネント
const ApplicationDeleteConfirmDialog = ({
  open,
  applicationTitle,
  isDeleting,
  onCancel,
  onConfirm,
}: ApplicationDeleteConfirmDialogProps) => {
  const handleClose: DialogProps["onClose"] = (_event, reason) => {
    // 削除処理中は、バックドロップクリックやエスケープキーでのダイアログ閉鎖を無効化
    if (
      isDeleting &&
      (reason === "backdropClick" || reason === "escapeKeyDown")
    ) {
      return;
    }

    onCancel();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>申請を削除しますか？</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {applicationTitle
            ? `「${applicationTitle}」を削除してもよろしいですか？`
            : ""}
        </DialogContentText>
      </DialogContent>

      <DialogActions>
        <Button onClick={onCancel} disabled={isDeleting}>
          キャンセル
        </Button>
        <Button
          onClick={onConfirm}
          color="error"
          variant="contained"
          disabled={isDeleting}
        >
          削除する
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ApplicationDeleteConfirmDialog;
