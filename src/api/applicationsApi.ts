import type {
  ApplicationDetail,
  ApplicationListItem,
  UpdateApplicationRequest,
  CreateApplicationRequest,
} from "../types/application";
import apiClient from "./apiClient";

// 申請一覧を取得する関数
export async function getApplications(): Promise<ApplicationListItem[]> {
  const response = await apiClient.get<ApplicationListItem[]>("/applications");
  return response.data;
}

// 申請詳細を取得する関数
export async function getApplicationById(
  id: number,
): Promise<ApplicationDetail> {
  const response = await apiClient.get<ApplicationDetail>(
    `/applications/${id}`,
  );
  return response.data;
}

// 申請を新規作成する関数
export async function createApplication(
  request: CreateApplicationRequest,
): Promise<void> {
  await apiClient.post("/applications", request);
}

// 申請を更新する関数
export async function updateApplication(
  id: number,
  request: UpdateApplicationRequest,
): Promise<void> {
  await apiClient.put(`/applications/${id}`, request);
}

// 申請を削除する関数
export async function deleteApplication(id: number): Promise<void> {
  await apiClient.delete(`/applications/${id}`);
}

// 申請のステータスを更新する関数
export async function updateApplicationStatus(
  id: number,
  status: "Approved" | "Rejected",
): Promise<void> {
  await apiClient.patch(`/applications/${id}/status`, { status });
}
