import type { TokenPayload } from "../../../../@types/tokens.d.ts";
import { Membership } from "../../../../app/enums/Membership.ts";
import type { IHelper } from "../../../../app/interfaces/IHelper.ts";

export class PayloadHelper implements IHelper {
  public static isValidPayload(obj: unknown): obj is TokenPayload {
    if (typeof obj !== "object" || obj === null) {
      return false;
    }
    const payload: TokenPayload = obj as TokenPayload;
    return (
      typeof payload.accountId === "number" &&
      Object.values(Membership).includes(payload.membership as Membership) &&
      typeof payload.sessionId === "number"
    );
  }
}
