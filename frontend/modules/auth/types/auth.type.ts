export type AuthUser = {
  sub: string;
  email: string;
  name: string;
};

export type LoginInput = {
  email: string;
  password: string;
};

export type RegisterInput = {
  name: string;
  email: string;
  password: string;
};

export type AuthSession = {
  user: AuthUser;
};
