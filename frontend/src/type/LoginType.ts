type LoginResponseType = {
  email?: string;
  token?: string;
  type?: string;
};

type LoginPayloadType = {
  email: string;
  password: string;
};

export type { LoginResponseType, LoginPayloadType };
