import type { AccountType } from "../app/enums/AccountType";

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
