import { removeToken } from "./auth";

// ログアウト処理を行う関数
export const logout = () => {
  removeToken();
};
