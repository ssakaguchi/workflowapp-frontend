import type { ChipProps } from "@mui/material";

import type { ApplicationStatus } from "../types/application";

// ステータスに対応する表示ラベルを定義
export const applicationStatusLabels: Record<ApplicationStatus, string> = {
  Pending: "申請中",
  Approved: "承認済み",
  Rejected: "却下",
};

// ステータスに応じたChipの色を定義
export const applicationStatusColors: Record<
  ApplicationStatus,
  ChipProps["color"]
> = {
  Pending: "warning",
  Approved: "success",
  Rejected: "error",
};

// ステータスに対応する表示ラベルを取得する関数 (存在しないステータスの場合はそのまま返す)
export const getApplicationStatusLabel = (status: ApplicationStatus): string =>
  applicationStatusLabels[status] ?? status;
