import { Box, Button } from "@mui/material";

// 申請の承認・却下ボタンコンポーネント
type ApplicationActionStatus = "Approved" | "Rejected";

// ApplicationDetailPageから切り出した申請の承認・却下ボタンコンポーネント
interface ApprovalActionButtons {
  onOpenStatusConfirm: (status: ApplicationActionStatus) => void;
  isStatusUpdating: boolean;
}

// 申請の承認・却下ボタンコンポーネント
const ApplicationActionButtons = ({
  onOpenStatusConfirm,
  isStatusUpdating,
}: ApprovalActionButtons) => {
  return (
    <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
      <Button
        variant="contained"
        color="success"
        onClick={() => onOpenStatusConfirm("Approved")}
        disabled={isStatusUpdating}
      >
        承認
      </Button>
      <Button
        variant="contained"
        color="error"
        onClick={() => onOpenStatusConfirm("Rejected")}
        disabled={isStatusUpdating}
      >
        却下
      </Button>
    </Box>
  );
};

export default ApplicationActionButtons;
