import { Link as RouterLink } from "react-router-dom";
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

// 申請一覧のテーブル表示コンポーネント
type Props = {
  applications: ApplicationListItem[];
  onDelete?: (id: number) => void;
};

export function ApplicationListTable({ applications, onDelete }: Props) {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>ID</TableCell>
          <TableCell>タイトル</TableCell>
          <TableCell>作成日時</TableCell>
          <TableCell>更新日時</TableCell>
          <TableCell>操作</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {applications.map((application) => (
          <TableRow key={application.id}>
            <TableCell>{application.id}</TableCell>
            <TableCell>{application.title}</TableCell>
            <TableCell>{application.createdAt}</TableCell>
            <TableCell>{application.updatedAt}</TableCell>
            <TableCell>
              <Stack direction="row" spacing={1}>
                <Button
                  component={RouterLink}
                  to={`/applications/${application.id}`}
                  variant="outlined"
                  size="small"
                >
                  詳細
                </Button>
                <Button
                  component={RouterLink}
                  to={`/applications/${application.id}/edit`}
                  variant="outlined"
                  size="small"
                >
                  編集
                </Button>

                <Button
                  variant="contained"
                  color="error"
                  size="small"
                  onClick={() => onDelete?.(application.id)}
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
