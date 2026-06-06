import type { UserRole } from "../types/auth";

export const roleStorage = {
  get: (): UserRole | null => {
    const role = localStorage.getItem("role");

    if (role === "Applicant" || role === "Approver") {
      return role;
    }

    return null;
  },

  set: (role: UserRole) => {
    localStorage.setItem("role", role);
  },

  remove: () => {
    localStorage.removeItem("role");
  },
};
