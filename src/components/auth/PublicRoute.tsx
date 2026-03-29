import { Navigate } from "react-router-dom";
import { isAuthenticated } from "../../utils/auth";
import type { JSX } from "@emotion/react/jsx-runtime";

type PublicRouteProps = {
  children: JSX.Element;
};

const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  if (isAuthenticated()) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default PublicRoute;
