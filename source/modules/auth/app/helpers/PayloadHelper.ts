import type { TokenPayload } from "../../../../@types/tokens";
import { AccountType } from "../../../../app/enums/AccountType";
import type { IHelper } from "../../../../app/interfaces/IHelper";

export class PayloadHelper implements IHelper {
  public static isValidPayload(obj: unknown): obj is TokenPayload {
    if (typeof obj !== "object" || obj === null) {
      return false;
    }
    const payload: TokenPayload = obj as TokenPayload;
    return (
      typeof payload.accountId === "number" &&
      Object.values(AccountType).includes(payload.accountType as AccountType) &&
      typeof payload.sessionId === "number"
    );
  }
}
