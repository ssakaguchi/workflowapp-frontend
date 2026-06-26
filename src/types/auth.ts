export type LoginRequest = {
  loginId: string;
  password: string;
};

export type RegisterRequest = {
  loginId: string;
  displayName: string;
  password: string;
};

export type UserRole = "Applicant" | "Approver" | "Admin";

export type LoginResponse = {
  token: string;
  role: UserRole;
};

export type CurrentUser = {
  userId: number;
  loginId: string;
  displayName: string;
  role: UserRole;
};
