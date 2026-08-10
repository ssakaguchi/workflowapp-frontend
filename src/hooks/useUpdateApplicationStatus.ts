import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateApplicationStatus } from "../api/applicationsApi";
import { applicationQueryKeys } from "../queries/applicationQueryKeys";

type UpdateApplicationStatusVariables = {
  applicationId: number;
  status: "Approved" | "Rejected";
};

export default function useUpdateApplicationStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ applicationId, status }: UpdateApplicationStatusVariables) =>
      updateApplicationStatus(applicationId, status),

    onSuccess: async (_, variables) => {
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
