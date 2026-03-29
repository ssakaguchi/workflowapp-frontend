import axios from "axios";
import { getToken } from "../utils/auth";
import type { CurrentUser } from "../types/auth";

const API_BASE_URL = "http://localhost:5071";

// 現在のユーザー情報を取得する関数
export const getCurrentUser = async (): Promise<CurrentUser> => {
  const token = getToken();

  // トークンが存在しない場合はエラーをスロー
  const response = await axios.get<CurrentUser>(`${API_BASE_URL}/api/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};
