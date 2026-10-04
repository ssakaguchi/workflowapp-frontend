import type { DefaultValues } from "react-hook-form";
import type { ApplicationCreateFormValues } from "../schemas/applicationCreateSchema";

const APPLICATION_DRAFT_KEY = "applicationDraft";

const emptyDefaultValues: DefaultValues<ApplicationCreateFormValues> = {
  title: "",
  content: "",
  approverUserId: undefined,
};

export const applicationDraftStorage = {
  get(): DefaultValues<ApplicationCreateFormValues> {
    const savedDraft = localStorage.getItem(APPLICATION_DRAFT_KEY);

    if (!savedDraft) {
      return emptyDefaultValues;
    }

    try {
      return JSON.parse(savedDraft);
    } catch {
      return emptyDefaultValues;
    }
  },

  set(draft: DefaultValues<ApplicationCreateFormValues>): void {
    localStorage.setItem(APPLICATION_DRAFT_KEY, JSON.stringify(draft));
  },

  remove(): void {
    localStorage.removeItem(APPLICATION_DRAFT_KEY);
  },
};
