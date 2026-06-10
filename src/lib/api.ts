import axios from "axios";

import { getToken } from "../utils/auth";

// APIクライアントを作成
export const api = axios.create({
  baseURL: "http://localhost:5071",
});

api.interceptors.request.use((config) => {
  const token = getToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
