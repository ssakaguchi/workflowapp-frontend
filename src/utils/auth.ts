export const TOKEN_KEY = "auth_token";

// JWTトークンをlocalStorageに保存
export const setToken = (token: string) => {
  localStorage.setItem(TOKEN_KEY, token);
};

// JWTトークンをlocalStorageから取得
export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

// JWTトークンをlocalStorageから削除
export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

// 認証状態を確認する関数
export const isAuthenticated = (): boolean => {
  return !!getToken();
};
