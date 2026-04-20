import type {
  ApplicationDetail,
  ApplicationListItem,
} from "../types/application";
import apiClient from "./apiClient";

// 申請一覧を取得する関数
export async function getApplications(): Promise<ApplicationListItem[]> {
  const response = await apiClient.get<ApplicationListItem[]>("/applications");
  return response.data;
}

// 申請詳細を取得する関数
export async function getApplicationDetail(
  id: number,
): Promise<ApplicationDetail> {
  const response = await apiClient.get<ApplicationDetail>(
    `/applications/${id}`,
  );
  return response.data;
}
