import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createApplication } from "../api/applicationsApi";
import { applicationQueryKeys } from "../queries/applicationQueryKeys";
import type { CreateApplicationRequest } from "../types/application";

export default function useCreateApplication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: CreateApplicationRequest) =>
      createApplication(request),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: applicationQueryKeys.lists(),
      });
    },
  });
}
