import { Paper,Stack, Typography } from "@mui/material";

import type { ApplicationDetail } from "../../types/application";
import { formatDateTime } from "../../utils/formatDateTime";
import { statusLabel } from "../../utils/statusLabel";

const ApplicationDetailInfo = ({
  application,
}: {
  application: ApplicationDetail;
}) => {
  return (
    <Paper sx={{ p: 3 }}>
      <Stack spacing={2}>
        <Typography>ID: {application.id}</Typography>
        <Typography>タイトル: {application.title}</Typography>
        <Typography>内容: {application.content}</Typography>
        <Typography>ステータス: {statusLabel(application.status)}</Typography>
        <Typography>
          作成日時: {formatDateTime(application.createdAt)}
        </Typography>
      </Stack>
    </Paper>
  );
};

export default ApplicationDetailInfo;
