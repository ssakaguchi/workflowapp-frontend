import {
  Box,
  Button,
  Container,
  Link,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";

import useRegister from "../hooks/useRegister";
import {
  type RegisterFormValues,
  registerSchema,
} from "../schemas/registerSchema";

// フォームの入力エラーを管理するための型定義
type FormErrors = Partial<Record<keyof RegisterFormValues, string>>;

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const registerMutation = useRegister();
  const [loginId, setLoginId] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [password, setPassword] = useState("");

  const [errors, setErrors] = useState<FormErrors>({});
  const [errorMessage, setErrorMessage] = useState("");

  // フォームの入力値を検証する関数
  const validate = (): FormErrors => {
    const result = registerSchema.safeParse({
      loginId,
      displayName,
      password,
    });

    if (result.success) {
      return {};
    }

    const fieldErrors = result.error.flatten().fieldErrors;

    return {
      loginId: fieldErrors.loginId?.[0],
      displayName: fieldErrors.displayName?.[0],
      password: fieldErrors.password?.[0],
    };
  };

  // フォームの送信処理を行う関数
  const handleRegister = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    setErrorMessage("");

    const validationErrors = validate();
    setErrors(validationErrors);

    // バリデーションエラーがある場合は登録処理を中断
    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    try {
      await registerMutation.mutateAsync({
        loginId,
        displayName,
        password,
      });

      navigate("/login");
    } catch {
      setErrorMessage(
        "ユーザー登録に失敗しました。入力内容を確認してください。",
      );
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
              disabled={registerMutation.isPending}
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
              disabled={registerMutation.isPending}
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
              disabled={registerMutation.isPending}
            />

            {errorMessage && (
              <Typography color="error">{errorMessage}</Typography>
            )}

            <Button
              type="submit"
              variant="contained"
              disabled={registerMutation.isPending}
            >
              {registerMutation.isPending ? "登録中..." : "登録"}
            </Button>

            <Link
              component={RouterLink}
              to="/login"
              underline="hover"
              aria-disabled={registerMutation.isPending}
              tabIndex={registerMutation.isPending ? -1 : undefined}
              onClick={(e) => {
                if (registerMutation.isPending) {
                  e.preventDefault();
                }
              }}
              sx={{
                pointerEvents: registerMutation.isPending ? "none" : "auto",
                opacity: registerMutation.isPending ? 0.5 : 1,
              }}
            >
              ログイン画面へ
            </Link>
          </Stack>
        </Box>
      </Box>
    </Container>
  );
};

export default RegisterPage;
