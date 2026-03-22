import { Box, Button, Container, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "../api/authApi";
import { tokenStorage } from "../utils/tokenStorage";

export function LoginPage() {
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    // フォーム送信時の画面リロードを防止
    e.preventDefault();

    // 送信時にエラーメッセージをリセット
    setErrorMessage("");

    try {
      // APIを呼び出してログイン処理を実行
      const result = await authApi.login({ loginId, password });

      // ログイン成功後、JWTを保存してホームページにリダイレクト
      tokenStorage.set(result.token);
      navigate("/");
    } catch (error) {
      setErrorMessage("ログインに失敗しました。");
    }
  };

  return (
    <Container maxWidth="sm">
      <Box mt={8}>
        <Typography variant="h4" gutterBottom>
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
            variant="contained"
            fullWidth
            sx={{ mt: 2 }}
          ></Button>
        </Box>

        {errorMessage && (
          <Typography color="error" mt={2}>
            {errorMessage}
          </Typography>
        )}
      </Box>
    </Container>
  );
}
