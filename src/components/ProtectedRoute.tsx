import { Navigate } from "react-router-dom";
import { tokenStorage } from "../utils/tokenStorage";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export function ProtectedRoute({ children }: Props) {
  const token = tokenStorage.get();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
