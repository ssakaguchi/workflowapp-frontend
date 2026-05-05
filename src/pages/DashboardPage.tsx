import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  CircularProgress,
  Container,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { getCurrentUser } from "../services/authService";
import type { CurrentUser } from "../types/auth";

const DashboardPage: React.FC = () => {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch {
        setErrorMessage("ユーザーが認証されていません。ログインしてください。");
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, []);

  return (
    <Container maxWidth="md">
      <Box sx={{ p: 4 }}>
        {isLoading && (
          <Box display="flex" justifyContent="center" mt={4}>
            <CircularProgress />
          </Box>
        )}
        {!isLoading && errorMessage && (
          <Alert severity="error" sx={{ mt: 4 }}>
            {errorMessage}
          </Alert>
        )}

        {!isLoading && user && (
          <Paper sx={{ p: 3, mt: 4 }}>
            <Stack spacing={2}>
              <Typography variant="h6">ログイン中ユーザー情報</Typography>
              <Typography>ログインID: {user.loginId}</Typography>
              <Typography>表示名: {user.displayName}</Typography>
            </Stack>
          </Paper>
        )}
      </Box>
    </Container>
  );
};

export default DashboardPage;
