export const applicationQueryKeys = {
  all: ["applications"] as const,

  details: () => [...applicationQueryKeys.all, "detail"] as const,

  detail: (applicationId: number) =>
    [...applicationQueryKeys.details(), applicationId] as const,
};
