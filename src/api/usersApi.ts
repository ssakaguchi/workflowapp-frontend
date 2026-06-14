import type { Approver } from "../types/application";
import apiClient from "./apiClient";

// 承認者の一覧を取得する関数
export async function getApprovers(): Promise<Approver[]> {
  const response = await apiClient.get<Approver[]>("users/approvers");
  return response.data;
}
