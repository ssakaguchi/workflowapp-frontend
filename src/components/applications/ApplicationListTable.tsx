import {
  Button,
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
            <TableCell>{application.status}</TableCell>
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
