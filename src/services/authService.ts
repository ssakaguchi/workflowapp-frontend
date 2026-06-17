import apiClient from "../api/apiClient";
import type { CurrentUser } from "../types/auth";
import { getToken } from "../utils/auth";

// 現在のユーザー情報を取得する関数
export const getCurrentUser = async (): Promise<CurrentUser> => {
  const token = getToken();

  if (!token) {
    throw new Error("TOKEN_NOT_FOUND");
  }

  // トークンが存在しない場合はエラーをスロー
  const response = await apiClient.get<CurrentUser>(`/api/auth/me`, {});

  return response.data;
};
