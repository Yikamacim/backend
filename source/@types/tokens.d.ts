import type { EAccountType } from "../common/enums/EAccountType";

export type Tokens = {
  accessToken: string;
  refreshToken: string;
};

export type TokenPayload = {
  accountId: number;
  accountType: EAccountType;
  sessionId: number;
};

export type AccessTokenPayload = TokenPayload & {
  isAccessToken: true;
};
