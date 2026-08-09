import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateApplication } from "../api/applicationsApi";
import { applicationQueryKeys } from "../queries/applicationQueryKeys";
import type { UpdateApplicationRequest } from "../types/application";

type UpdateApplicationVariables = {
  applicationId: number;
  request: UpdateApplicationRequest;
};

export default function useUpdateApplication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ applicationId, request }: UpdateApplicationVariables) =>
      updateApplication(applicationId, request),

    onSuccess: async (_data, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: applicationQueryKeys.detail(variables.applicationId),
        }),
        queryClient.invalidateQueries({
          queryKey: applicationQueryKeys.lists(),
        }),
      ]);
    },
  });
}
