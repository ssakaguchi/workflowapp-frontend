import {
  Box,
  Button,
  Container,
  Link,
  TextField,
  Typography,
  Paper,
} from "@mui/material";
import { useState } from "react";
import { authApi } from "../api/authApi";
import { tokenStorage } from "../utils/tokenStorage";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { roleStorage } from "../utils/roleStorage";

export function LoginPage() {
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    // フォーム送信時の画面リロードを防止
    e.preventDefault();

    // 送信時にエラーメッセージをリセット
    setErrorMessage("");

    try {
      // APIを呼び出してログイン処理を実行
      const result = await authApi.login({ loginId, password });

      // ログイン成功後、JWTを保存して申請一覧ページへ遷移
      tokenStorage.set(result.token);

      // ユーザーロールを保存
      roleStorage.set(result.role);

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
          />
          <TextField
            label="パスワード"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            color="primary"
            variant="contained"
            fullWidth
            sx={{ mt: 2 }}
          >
            ログイン
          </Button>

          <Link component={RouterLink} to="/register" underline="hover">
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
