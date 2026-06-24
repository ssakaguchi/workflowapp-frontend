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
import {
  applicationStatusColors,
  getApplicationStatusLabel,
} from "../../utils/applicationStatus";
import { formatDateTime } from "../../utils/formatDateTime";

// 申請一覧のテーブル表示コンポーネント
type Props = {
  applications: ApplicationListItem[];
  onDelete?: (application: ApplicationListItem) => void;
  showEdit?: boolean;
  showDelete?: boolean;
};

export function ApplicationListTable({
  applications,
  onDelete,
  showEdit = true,
  showDelete = true,
}: Props) {
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
                label={getApplicationStatusLabel(application.status)}
                color={applicationStatusColors[application.status]}
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

                {showEdit && (
                  <Button
                    variant="outlined"
                    size="small"
                    component={RouterLink}
                    to={`/applications/${application.id}/edit`}
                  >
                    編集
                  </Button>
                )}

                {showDelete && onDelete && (
                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    onClick={() => onDelete?.(application)}
                  >
                    削除
                  </Button>
                )}
              </Stack>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
