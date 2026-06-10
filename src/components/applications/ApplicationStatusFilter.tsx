import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  type SelectChangeEvent,
} from "@mui/material";

import type { StatusFilter } from "../../types/application";

// 申請のステータスフィルタコンポーネント
const ApplicationStatusFilter = ({
  selectedStatus,
  handleStatusChange,
}: {
  selectedStatus: StatusFilter;
  handleStatusChange: (event: SelectChangeEvent<string>) => void;
}) => {
  return (
    <FormControl size="small" sx={{ minWidth: 160 }}>
      <InputLabel id="status-filter-label">ステータス</InputLabel>
      <Select
        labelId="status-filter-label"
        value={selectedStatus}
        label="ステータス"
        onChange={handleStatusChange}
      >
        <MenuItem value="All">すべて</MenuItem>
        <MenuItem value="Pending">申請中</MenuItem>
        <MenuItem value="Approved">承認済み</MenuItem>
        <MenuItem value="Rejected">却下</MenuItem>
      </Select>
    </FormControl>
  );
};

export default ApplicationStatusFilter;
