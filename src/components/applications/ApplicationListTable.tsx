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
import type { ApplicationListItem } from "../../types/application";
import { Link as RouterLink } from "react-router-dom";

// 申請一覧のテーブル表示コンポーネント
type Props = {
  applications: ApplicationListItem[];
  onDelete?: (application: ApplicationListItem) => void;
};

export function ApplicationListTable({ applications, onDelete }: Props) {
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
            <TableCell>{application.createdAt}</TableCell>
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
                  variant="contained"
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
