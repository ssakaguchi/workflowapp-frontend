import type { ApplicationListItem } from "../types/application";
import apiClient from "./apiClient";

// アプリケーションの一覧を取得する関数
export async function getApplications(): Promise<ApplicationListItem[]> {
  const response = await apiClient.get<ApplicationListItem[]>("/applications");
  return response.data;
}
