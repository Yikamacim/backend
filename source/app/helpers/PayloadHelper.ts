import type { TokenPayload } from "../../@types/tokens";
import type { ExpressResponse } from "../../@types/wrappers";
import { LocalsConstants } from "../constants/LocalsConstants";
import { AccountType } from "../enums/AccountType";
import type { IHelper } from "../interfaces/IHelper";
import { UnexpectedAuthError } from "../schemas/ServerError";

export class PayloadHelper implements IHelper {
  public static getPayload<T>(res: ExpressResponse<T>): TokenPayload {
    const local: unknown = res.locals[LocalsConstants.TOKEN_PAYLOAD];
    if (!PayloadHelper.isValidPayload(local)) {
      throw new UnexpectedAuthError();
    }
    return local;
  }
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
