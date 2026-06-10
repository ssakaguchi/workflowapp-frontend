import axios from "axios";

import { tokenStorage } from "../utils/tokenStorage";

const apiBaseURL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5071/api";

// APIクライアントを作成
const apiClient = axios.create({
  baseURL: apiBaseURL,
});

// リクエストインターセプターを使用して、すべてのリクエストに認証トークンを自動的に追加
apiClient.interceptors.request.use((config) => {
  const token = tokenStorage.get();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default apiClient;
