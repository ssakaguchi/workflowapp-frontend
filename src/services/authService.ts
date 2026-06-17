import apiClient from "../api/apiClient";
import type { CurrentUser } from "../types/auth";

// 現在のユーザー情報を取得する関数
export const getCurrentUser = async (): Promise<CurrentUser> => {
  const response = await apiClient.get<CurrentUser>(`/auth/me`);

  return response.data;
};
