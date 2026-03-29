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

// フォームの入力エラーを管理するための型定義   w
type FormErrors = {
  loginId?: string;
  displayName?: string;
  password?: string;
};

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();

  const [loginId, setLoginId] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [password, setPassword] = useState("");

  const [errors, setErrors] = useState<FormErrors>({});
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // フォームの入力値を検証する関数
  const validate = (): FormErrors => {
    const newErrors: FormErrors = {};

    if (!loginId.trim()) {
      newErrors.loginId = "ログインIDを入力してください。";
    } else if (loginId.length < 3) {
      newErrors.loginId = "ログインIDは3文字以上で入力してください。";
    }

    if (!displayName.trim()) {
      newErrors.displayName = "表示名を入力してください。";
    } else if (displayName.length > 20) {
      newErrors.displayName = "表示名は20文字以内で入力してください。";
    }
    if (!password.trim()) {
      newErrors.password = "パスワードを入力してください。";
    } else if (password.length < 8) {
      newErrors.password = "パスワードは8文字以上で入力してください。";
    } else if (!/^(?=.*[A-Za-z])(?=.*\d).+$/.test(password)) {
      newErrors.password = "パスワードは英字と数字を含めてください。";
    }
    return newErrors;
  };

  // フォームの送信処理を行う関数
  const handleRegister = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    debugger;

    setErrorMessage("");

    const validationErrors = validate();
    setErrors(validationErrors);

    // バリデーションエラーがある場合は登録処理を中断
    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    // 登録処理を開始する前に送信状態を設定
    setIsSubmitting(true);
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
              onChange={(e) => {
                setLoginId(e.target.value);
                setErrors((prev) => ({ ...prev, loginId: undefined }));
              }}
              fullWidth
              required
              error={!!errors.loginId}
              helperText={errors.loginId}
            />

            <TextField
              label="表示名"
              value={displayName}
              onChange={(e) => {
                setDisplayName(e.target.value);
                setErrors((prev) => ({ ...prev, displayName: undefined }));
              }}
              fullWidth
              required
              error={!!errors.displayName}
              helperText={errors.displayName}
            />

            <TextField
              label="パスワード"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setErrors((prev) => ({ ...prev, password: undefined }));
              }}
              fullWidth
              required
              error={!!errors.password}
              helperText={errors.password}
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
