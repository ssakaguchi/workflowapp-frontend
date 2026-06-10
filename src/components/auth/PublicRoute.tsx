import type { JSX } from "@emotion/react/jsx-runtime";
import { Navigate } from "react-router-dom";

import { isAuthenticated } from "../../utils/auth";

type PublicRouteProps = {
  children: JSX.Element;
};

const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  if (isAuthenticated()) {
    // ログインしている場合は申請一覧にリダイレクト
    return <Navigate to="/applications" replace />;
  }

  return children;
};

export default PublicRoute;
