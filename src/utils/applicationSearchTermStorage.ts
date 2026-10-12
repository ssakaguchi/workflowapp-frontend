const APPLICATION_SEARCH_TERM_KEY = "applicationSearchTerm";

export const applicationSearchTermStorage = {
  get(): string {
    return localStorage.getItem(APPLICATION_SEARCH_TERM_KEY) ?? "";
  },

  set(searchTerm: string): void {
    localStorage.setItem(APPLICATION_SEARCH_TERM_KEY, searchTerm);
  },

  remove(): void {
    localStorage.removeItem(APPLICATION_SEARCH_TERM_KEY);
  },
};
