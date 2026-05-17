export type AuthUser = {
  userId: string;
  fullName: string;
  email: string;
  role: string;
  companyId: string;
  isPlatformAdmin: boolean;
};

export type LoginRequest = {
  email: string;
  password: string;
  rememberMe: boolean;
};

export type LoginResponse = AuthUser;
