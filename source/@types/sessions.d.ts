import type { AccountType } from "../app/enums/AccountType";

export type SessionData = {
  accountId: number;
  accountType: AccountType;
  deviceName: string;
  sessionKey: string;
};
