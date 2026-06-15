import { MenuItem, TextField } from "@mui/material";

import type { Approver } from "../../types/application";

// 承認者選択のセレクトボックスコンポーネント
type ApproverSelectBoxProps = {
  approvers: Approver[];
  selectedApproverUserId: number | undefined;
  setSelectedApproverUserId: (userId: number | undefined) => void;
  approverError: string;
};

// 承認者選択のセレクトボックスコンポーネント
const ApproverSelectBox = ({
  approvers,
  selectedApproverUserId,
  setSelectedApproverUserId,
  approverError,
}: ApproverSelectBoxProps) => {
  return (
    <TextField
      select
      label="承認者"
      value={selectedApproverUserId ?? ""}
      onChange={(e) => {
        const value = e.target.value;
        setSelectedApproverUserId(value === "" ? undefined : Number(value));
      }}
      fullWidth
      required
      error={Boolean(approverError)}
      helperText={approverError || "申請を回付する承認者を選択してください。"}
    >
      {approvers.map((approver) => (
        <MenuItem key={approver.userId} value={approver.userId}>
          {approver.displayName}
        </MenuItem>
      ))}
    </TextField>
  );
};

export default ApproverSelectBox;
