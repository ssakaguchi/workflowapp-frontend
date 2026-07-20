import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // 取得後30秒間は新鮮なデータとして扱う
      staleTime: 30_000,

      // API取得失敗時の再試行を1回に抑える
      retry: 1,
    },
  },
});
