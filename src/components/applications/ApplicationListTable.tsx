import {
  Button,
  Chip,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

import type { ApplicationListItem } from "../../types/application";
import { formatDateTime } from "../../utils/formatDateTime";
import { statusLabel } from "../../utils/statusLabel";

// 申請一覧のテーブル表示コンポーネント
type Props = {
  applications: ApplicationListItem[];
  onDelete?: (application: ApplicationListItem) => void;
};

export function ApplicationListTable({ applications, onDelete }: Props) {
  // ステータスに応じたChipの色を返す関数
  const statusColor = (
    status: string,
  ): "default" | "success" | "error" | "warning" => {
    switch (status) {
      case "Pending":
        return "warning";
      case "Approved":
        return "success";
      case "Rejected":
        return "error";
      default:
        return "default";
    }
  };

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>ID</TableCell>
          <TableCell>タイトル</TableCell>
          <TableCell>ステータス</TableCell>
          <TableCell>作成日時</TableCell>
          <TableCell>操作</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {applications.map((application) => (
          <TableRow key={application.id}>
            <TableCell>{application.id}</TableCell>
            <TableCell>{application.title}</TableCell>
            <TableCell>
              <Chip
                label={statusLabel(application.status)}
                color={statusColor(application.status)}
                size="small"
              />
            </TableCell>
            <TableCell>{formatDateTime(application.createdAt)}</TableCell>
            <TableCell>
              <Stack direction="row" spacing={1}>
                <Button
                  variant="outlined"
                  size="small"
                  component={RouterLink}
                  to={`/applications/${application.id}`}
                >
                  詳細
                </Button>

                <Button
                  variant="outlined"
                  size="small"
                  component={RouterLink}
                  to={`/applications/${application.id}/edit`}
                >
                  編集
                </Button>

                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                  onClick={() => onDelete?.(application)}
                >
                  削除
                </Button>
              </Stack>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
