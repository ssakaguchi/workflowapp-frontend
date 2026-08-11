import {
  Box,
  Button,
  Container,
  Link,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";

import useLogin from "../hooks/useLogin";

export function LoginPage() {
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const loginMutation = useLogin();

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    // フォーム送信時の画面リロードを防止
    e.preventDefault();

    // 送信時にエラーメッセージをリセット
    setErrorMessage("");

    try {
      // ログイン処理を実行
      await loginMutation.mutateAsync({
        loginId,
        password,
      });

      navigate("/applications");
    } catch {
      setErrorMessage("ログインに失敗しました。");
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" align="center" gutterBottom>
          ログイン
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            label="ログインID"
            fullWidth
            margin="normal"
            value={loginId}
            onChange={(e) => setLoginId(e.target.value)}
            disabled={loginMutation.isPending}
          />
          <TextField
            label="パスワード"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loginMutation.isPending}
          />
          <Button
            type="submit"
            color="primary"
            variant="contained"
            fullWidth
            sx={{ mt: 2 }}
            disabled={loginMutation.isPending}
          >
            ログイン
          </Button>

          <Link
            component={RouterLink}
            to="/register"
            underline="hover"
            aria-disabled={loginMutation.isPending}
            tabIndex={loginMutation.isPending ? -1 : undefined}
            sx={{
              pointerEvents: loginMutation.isPending ? "none" : "auto",
              opacity: loginMutation.isPending ? 0.5 : 1,
            }}
          >
            ユーザー登録はこちら
          </Link>
        </Box>

        {errorMessage && (
          <Typography color="error" mt={2}>
            {errorMessage}
          </Typography>
        )}
      </Paper>
    </Container>
  );
}
