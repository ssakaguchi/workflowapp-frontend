import {
  Alert,
  Box,
  CircularProgress,
  Container,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

import useCurrentUser from "../hooks/useCurrentUser";

const DashboardPage: React.FC = () => {
  const { data: user, isLoading, isError } = useCurrentUser();

  return (
    <Container maxWidth="md">
      <Box sx={{ p: 4 }}>
        {isLoading && (
          <Box display="flex" justifyContent="center" mt={4}>
            <CircularProgress />
          </Box>
        )}
        {!isLoading && isError && (
          <Alert severity="error" sx={{ mt: 4 }}>
            ユーザーが認証されていません。ログインしてください。
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
