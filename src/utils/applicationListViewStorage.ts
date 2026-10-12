import type { ListView } from "../types/application";

const APPLICATION_LIST_VIEW_KEY = "applicationListView";

export const applicationListViewStorage = {
  get(): ListView | null {
    const savedListView = localStorage.getItem(APPLICATION_LIST_VIEW_KEY);

    if (
      savedListView === "myApplications" ||
      savedListView === "approvalRequests" ||
      savedListView === "admin"
    ) {
      return savedListView;
    }

    return null;
  },

  set(listView: ListView): void {
    localStorage.setItem(APPLICATION_LIST_VIEW_KEY, listView);
  },

  remove(): void {
    localStorage.removeItem(APPLICATION_LIST_VIEW_KEY);
  },
};
