import axios from "axios";
import { tokenStorage } from "../utils/tokenStorage";

// APIクライアントを作成
const apiClient = axios.create({
  baseURL: "http://localhost:5071/api",
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
