export const userQueryKeys = {
  all: ["users"] as const,

  approvers: () => [...userQueryKeys.all, "approvers"] as const,
};
