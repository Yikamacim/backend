import type { IValidator } from "../../app/interfaces/IValidator";
import { ClientError, ClientErrorCode } from "../../app/schemas/ClientError";
import { StringUtil } from "../../app/utils/StringUtil";
import { BankRules } from "../rules/BankRules";

export class BankOwnerValidator implements IValidator {
  public static validate(data: string, validationErrors: ClientError[]): void {
    if (!StringUtil.isInLengthRange(data, BankRules.OWNER_MIN_LENGTH, BankRules.OWNER_MAX_LENGTH)) {
      validationErrors.push(new ClientError(ClientErrorCode.INVALIDD_OWNER_LENGTH));
    }
    if (!StringUtil.matchesRegex(data, BankRules.OWNER_REGEX)) {
      validationErrors.push(new ClientError(ClientErrorCode.INVALID_OWNER_CONTENT));
    }
  }
}
