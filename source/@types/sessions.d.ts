import type { AccountType } from "../app/enums/AccountType.ts";

export type SessionData = {
  accountId: number;
  accountType: AccountType;
  deviceName: string;
  sessionKey: string;
};
