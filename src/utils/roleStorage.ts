import type { UserRole } from "../types/auth";
const ROLE_KEY = "role";

export const roleStorage = {
  get: (): UserRole | null => {
    const role = localStorage.getItem(ROLE_KEY);

    if (role === "Applicant" || role === "Approver" || role === "Admin") {
      return role;
    }

    return null;
  },

  set: (role: UserRole) => {
    localStorage.setItem(ROLE_KEY, role);
  },

  remove: () => {
    localStorage.removeItem(ROLE_KEY);
  },
};
