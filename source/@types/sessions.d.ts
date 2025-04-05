import type { AccountType } from "../common/enums/AccountType";

export type SessionData = {
  accountId: number;
  accountType: AccountType;
  deviceName: string;
  sessionKey: string;
};
