import { zodResolver } from "@hookform/resolvers/zod";
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
import { useForm } from "react-hook-form";
import { Link as RouterLink, useNavigate } from "react-router-dom";

import useLogin from "../hooks/useLogin";
import { type LoginFormValues, loginSchema } from "../schemas/loginSchema";

export function LoginPage() {
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const loginMutation = useLogin();

  /**
   * react-hook-formのuseFormフックを使用してフォームの状態を管理する
   * zodResolverを使用して、loginSchemaに基づいたバリデーションを行う
   * defaultValuesでフォームの初期値を設定する
   */
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema), // zodResolverを使用して、loginSchemaに基づいたバリデーションを行う
    defaultValues: {
      loginId: "",
      password: "",
    },
  });

  /**
   * フォームの送信時に呼び出される関数
   * @param values フォームの入力値
   */
  const onSubmit = async (values: LoginFormValues) => {
    setErrorMessage("");

    try {
      await loginMutation.mutateAsync(values);
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

        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <TextField
            label="ログインID"
            fullWidth
            margin="normal"
            {...register("loginId")}
            error={Boolean(errors.loginId)}
            helperText={errors.loginId?.message}
            disabled={loginMutation.isPending}
          />
          <TextField
            label="パスワード"
            type="password"
            fullWidth
            margin="normal"
            {...register("password")} // react-hook-formのregister関数を使用して、フォームの入力値を管理する
            error={Boolean(errors.password)}
            helperText={errors.password?.message}
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
            onClick={(e) => {
              if (loginMutation.isPending) {
                e.preventDefault();
              }
            }}
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
