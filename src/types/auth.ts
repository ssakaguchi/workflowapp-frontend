export type LoginRequest = {
  loginId: string;
  password: string;
};

export type RegisterRequest = {
  loginId: string;
  displayName: string;
  password: string;
};

export type LoginResponse = {
  token: string;
};

export type MeResponse = {
  userId: number;
  loginId: string;
  displayName: string;
};
