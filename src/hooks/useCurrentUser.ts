import { useQuery } from "@tanstack/react-query";

import { authQueryKeys } from "../queries/authQueryKeys";
import { getCurrentUser } from "../services/authService";

export default function useCurrentUser() {
  return useQuery({
    queryKey: authQueryKeys.currentUser(),
    queryFn: getCurrentUser,
  });
}
