import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

import type { ApplicationListItem } from "../../types/application";

type ApplicationDeleteConfirmDialogProps = {
  deleteTargetApplication: ApplicationListItem | null;
  isDeleting: boolean;
  handleDeleteCancel: () => void;
  handleDeleteConfirm: () => void;
};

// 申請削除の確認ダイアログコンポーネント
const ApplicationDeleteConfirmDialog = ({
  deleteTargetApplication,
  isDeleting,
  handleDeleteCancel,
  handleDeleteConfirm,
}: ApplicationDeleteConfirmDialogProps) => {
  return (
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
  );
};

export default ApplicationDeleteConfirmDialog;
