import type { AccountType } from "../app/enums/AccountType.ts";

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

export type RawTokenData = {
  accountId: number;
  accountType: AccountType;
  sessionKey: string;
};
