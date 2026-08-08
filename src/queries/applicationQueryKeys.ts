import type { ListView, StatusFilter } from "../types/application";

export const applicationQueryKeys = {
  all: ["applications"] as const,

  lists: () => [...applicationQueryKeys.all, "list"] as const,

  list: (listView: ListView, page: number, selectedStatus: StatusFilter) =>
    [
      ...applicationQueryKeys.lists(),
      { listView, page, selectedStatus },
    ] as const,

  details: () => [...applicationQueryKeys.all, "detail"] as const,

  detail: (applicationId: number) =>
    [...applicationQueryKeys.details(), applicationId] as const,
};
