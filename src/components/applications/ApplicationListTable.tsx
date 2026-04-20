import { Link as RouterLink, useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();

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
                  variant="outlined"
                  size="small"
                  onClick={() => navigate(`/applications/${application.id}`)}
                >
                  詳細
                </Button>

                <Button
                  variant="outlined"
                  size="small"
                  onClick={() =>
                    navigate(`/applications/${application.id}/edit`)
                  }
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
