import type { TokenPayload } from "../../@types/tokens";
import { AccountType } from "../enums/AccountType";
import type { IHelper } from "../interfaces/IHelper";

export class PayloadHelper implements IHelper {
  public static isValidPayload(obj: unknown): obj is TokenPayload {
    if (typeof obj !== "object" || obj === null) {
      return false;
    }
    const payload = obj as TokenPayload;
    return (
      typeof payload.accountId === "number" &&
      Object.values(AccountType).includes(payload.accountType) &&
      typeof payload.sessionId === "number"
    );
  }
}
