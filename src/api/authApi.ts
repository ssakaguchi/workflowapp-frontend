import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
} from "../types/auth";
import apiClient from "./apiClient";

// 認証関連のAPI呼び出しをまとめたオブジェクト
export const authApi = {
  async login(request: LoginRequest): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>(
      "/auth/login",
      request,
    );
    return response.data;
  },

  async register(request: RegisterRequest): Promise<void> {
    await apiClient.post("/auth/register", request);
  },
};
