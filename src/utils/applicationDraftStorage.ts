import type { DefaultValues } from "react-hook-form";

import type { ApplicationCreateFormValues } from "../schemas/applicationCreateSchema";
import { applicationDraftSchema } from "../schemas/applicationDraftSchema";

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
      const parsedDraft = JSON.parse(savedDraft);
      const result = applicationDraftSchema.safeParse(parsedDraft);

      if (!result.success) {
        return emptyDefaultValues;
      }

      return result.data;
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
