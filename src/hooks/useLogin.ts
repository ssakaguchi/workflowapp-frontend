import { useMutation, useQueryClient } from "@tanstack/react-query";

import { authApi } from "../api/authApi";
import { authQueryKeys } from "../queries/authQueryKeys";
import type { LoginRequest } from "../types/auth";
import { roleStorage } from "../utils/roleStorage";
import { tokenStorage } from "../utils/tokenStorage";

export default function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: LoginRequest) => authApi.login(request),
    onSuccess: (result) => {
      tokenStorage.set(result.token);
      roleStorage.set(result.role);

      queryClient.removeQueries({
        queryKey: authQueryKeys.all,
      });
    },
  });
}
