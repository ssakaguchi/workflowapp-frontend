import { zodResolver } from "@hookform/resolvers/zod";
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
import { useForm } from "react-hook-form";
import { Link as RouterLink, useNavigate } from "react-router-dom";

import useRegister from "../hooks/useRegister";
import {
  type RegisterFormValues,
  registerSchema,
} from "../schemas/registerSchema";

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const registerMutation = useRegister();
  const [errorMessage, setErrorMessage] = useState("");

  /**
   * react-hook-formのuseFormフックを使用してフォームの状態を管理する
   */
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      loginId: "",
      displayName: "",
      password: "",
    },
  });

  /**
   * フォームの送信時に呼び出される関数
   * @param values フォームの入力値
   */
  const onSubmit = async (values: RegisterFormValues) => {
    setErrorMessage("");

    try {
      await registerMutation.mutateAsync(values);
      navigate("/login");
    } catch {
      setErrorMessage(
        "ユーザー登録に失敗しました。入力内容を確認してください。",
      );
    }
  };

  const onInvalid = () => {
    setErrorMessage("");
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          ユーザー登録
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit(
            onSubmit, // バリデーション成功時
            onInvalid, // バリデーション失敗時
          )}
          noValidate // ブラウザのデフォルトのバリデーションを無効化する
        >
          <Stack spacing={2}>
            <TextField
              label="ログインID"
              {...register("loginId")}
              fullWidth
              required
              error={Boolean(errors.loginId)}
              helperText={errors.loginId?.message}
              disabled={registerMutation.isPending}
            />

            <TextField
              label="表示名"
              {...register("displayName")}
              fullWidth
              required
              error={Boolean(errors.displayName)}
              helperText={errors.displayName?.message}
              disabled={registerMutation.isPending}
            />

            <TextField
              label="パスワード"
              type="password"
              {...register("password")}
              fullWidth
              required
              error={Boolean(errors.password)}
              helperText={errors.password?.message}
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
