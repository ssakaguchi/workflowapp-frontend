import axios from "axios";
import type { LoginRequest, LoginResponse, MeResponse } from "../types/auth";
import { tokenStorage } from "../utils/tokenStorage";

// APIクライアントを作成
const api = axios.create({
  baseURL: "http://localhost:5071/api",
});

// リクエストインターセプターを使用して、すべてのリクエストに認証トークンを自動的に追加
api.interceptors.request.use((config) => {
  const token = tokenStorage.get();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// 認証関連のAPI呼び出しをまとめたオブジェクト
export const authApi = {
  async login(request: LoginRequest): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>("/auth/login", request);
    return response.data;
  },
};
