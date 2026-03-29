import { BrowserRouter, Route, Routes } from "react-router-dom";
import { LoginPage } from "./pages/LoginPage";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import RegisterPage from "./pages/RegisterPage";
import PublicRoute from "./components/auth/PublicRoute";
import DashboardPage from "./pages/DashboardPage";
import Header from "./components/layout/Header";

//　ルーティングの設定を行うAppコンポーネント
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
