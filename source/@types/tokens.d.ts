import type { AccountType } from "../common/enums/AccountType";

export type Token = string;

export type Tokens = {
  accessToken: Token;
  refreshToken: Token;
};

export type TokenPayload = {
  accountId: number;
  accountType: AccountType;
  sessionId: number;
};

export type AccessTokenPayload = TokenPayload & {
  isAccessToken: true;
};
