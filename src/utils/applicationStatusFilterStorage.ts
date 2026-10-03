import type { StatusFilter } from "../types/application";

const APPLICATION_STATUS_FILTER_KEY = "applicationStatusFilter";

export const applicationStatusFilterStorage = {
  get(): StatusFilter {
    const savedStatus = localStorage.getItem(APPLICATION_STATUS_FILTER_KEY);

    if (
      savedStatus === "All" ||
      savedStatus === "Pending" ||
      savedStatus === "Approved" ||
      savedStatus === "Rejected"
    ) {
      return savedStatus;
    }

    return "All";
  },

  set(status: StatusFilter): void {
    localStorage.setItem(APPLICATION_STATUS_FILTER_KEY, status);
  },

  remove(): void {
    localStorage.removeItem(APPLICATION_STATUS_FILTER_KEY);
  },
};
