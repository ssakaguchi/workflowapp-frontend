import { useState } from "react";
import {
  Box,
  Button,
  Container,
  Stack,
  TextField,
  Typography,
  Link,
} from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import axios from "axios";

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();

  const [loginId, setLoginId] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [password, setPassword] = useState("");

  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRegister = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    // 登録処理を開始する前に送信状態を設定
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      await axios.post("http://localhost:5071/api/auth/register", {
        loginId,
        displayName,
        password,
      });

      navigate("/login");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("status:", error.response?.status);
        console.error("data:", error.response?.data);
      } else {
        console.error(error);
      }
      setErrorMessage(
        "ユーザー登録に失敗しました。入力内容を確認してください。",
      );
    } finally {
      // 登録処理が完了した後、送信状態をリセット
      setIsSubmitting(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          ユーザー登録
        </Typography>

        <Box component="form" onSubmit={handleRegister}>
          <Stack spacing={2}>
            <TextField
              label="ログインID"
              value={loginId}
              onChange={(e) => setLoginId(e.target.value)}
              fullWidth
              required
            />

            <TextField
              label="表示名"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              fullWidth
              required
            />

            <TextField
              label="パスワード"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              required
            />

            {errorMessage && (
              <Typography color="error">{errorMessage}</Typography>
            )}

            <Button type="submit" variant="contained" disabled={isSubmitting}>
              {isSubmitting ? "登録中..." : "登録"}
            </Button>

            <Link component={RouterLink} to="/login" underline="hover">
              ログイン画面へ
            </Link>
          </Stack>
        </Box>
      </Box>
    </Container>
  );
};

export default RegisterPage;
