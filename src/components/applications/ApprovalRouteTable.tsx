import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

import type { ApprovalStepResponse } from "../../types/application";
import { statusLabel } from "../../utils/statusLabel";

const ApprovalRouteTable: React.FC<{
  approvalSteps: ApprovalStepResponse[];
}> = ({ approvalSteps }) => {
  return (
    <Paper sx={{ p: 3, mt: 3 }}>
      <Typography variant="h6" gutterBottom>
        承認ルート
      </Typography>

      {approvalSteps.length === 0 ? (
        <Typography color="text.secondary">承認ルートは未設定です。</Typography>
      ) : (
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>順番</TableCell>
              <TableCell>承認者</TableCell>
              <TableCell>ステータス</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {approvalSteps.map((step) => (
              <TableRow key={step.id}>
                <TableCell>{step.stepOrder}</TableCell>
                <TableCell>{step.approverUserId}</TableCell>
                <TableCell>{statusLabel(step.status)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Paper>
  );
};

export default ApprovalRouteTable;
