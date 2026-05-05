import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { LoginPage } from "./pages/LoginPage";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import RegisterPage from "./pages/RegisterPage";
import PublicRoute from "./components/auth/PublicRoute";
import DashboardPage from "./pages/DashboardPage";
import Header from "./components/layout/Header";
import { ApplicationListPage } from "./pages/ApplicationListPage";
import ApplicationDetailPage from "./pages/ApplicationDetailPage";
import ApplicationEditPage from "./pages/ApplicationEditPage";
import ApplicationCreatePage from "./pages/ApplicationCreatePage";

// ルーティングの設定を行うコンポーネント
function App() {
  return (
    <BrowserRouter>
      <Header />

      <Routes>
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <RegisterPage />
            </PublicRoute>
          }
        />
        <Route
          path="/"
          element={
            // ログインしている場合は申請一覧にリダイレクト、していない場合はログインページにリダイレクト
            <ProtectedRoute>
              <Navigate to="/applications" replace />
            </ProtectedRoute>
          }
        />
        <Route
          path="/applications"
          element={
            <ProtectedRoute>
              <ApplicationListPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/applications/:id"
          element={
            <ProtectedRoute>
              <ApplicationDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/applications/:id/edit"
          element={
            <ProtectedRoute>
              <ApplicationEditPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/applications/new"
          element={
            <ProtectedRoute>
              <ApplicationCreatePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
