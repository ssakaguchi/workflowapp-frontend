import { Navigate } from "react-router-dom";
import type { JSX } from "@emotion/react/jsx-runtime";
import { isAuthenticated } from "../../utils/auth";

// ProtectedRouteコンポーネントのプロパティの型定義
type ProtectedRouteProps = {
  children: JSX.Element;
};

// 認証されたユーザーのみがアクセスできるルートを定義するコンポーネント
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default ProtectedRoute;
