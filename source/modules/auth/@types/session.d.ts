import type { EAccountType } from "../../../common/enums/EAccountType";

export type SessionBundle = {
  readonly accountId: number;
  readonly accountType: EAccountType;
  readonly deviceName: string;
  readonly sessionKey: string;
};
