import { removeToken } from "./auth";
import { roleStorage } from "./roleStorage";

// ログアウト処理を行う関数
export const logout = () => {
  removeToken();
  roleStorage.remove();
};
