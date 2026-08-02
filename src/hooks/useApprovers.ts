import { useQuery } from "@tanstack/react-query";

import { getApprovers } from "../api/usersApi";
import { userQueryKeys } from "../queries/userQueryKeys";

export function useApprovers() {
  return useQuery({
    queryKey: userQueryKeys.approvers(), // 承認者一覧のクエリキーを指定
    queryFn: getApprovers, // 承認者一覧を取得するAPI関数を指定
    staleTime: 5 * 60_000, // データの鮮度を5分に設定
  });
}
