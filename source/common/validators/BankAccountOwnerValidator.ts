import type { IValidator } from "../../app/interfaces/IValidator";
import { ClientError, ClientErrorCode } from "../../app/schemas/ClientError";
import { StringUtil } from "../../app/utils/StringUtil";
import { BankAccountRules } from "../rules/BankAccountRules";

export class BankAccountOwnerValidator implements IValidator {
  public static validate(data: string, validationErrors: ClientError[]): void {
    if (
      !StringUtil.isInLengthRange(
        data,
        BankAccountRules.OWNER_MIN_LENGTH,
        BankAccountRules.OWNER_MAX_LENGTH,
      )
    ) {
      validationErrors.push(new ClientError(ClientErrorCode.INVALID_OWNER_LENGTH));
    }
    if (!StringUtil.matchesRegex(data, BankAccountRules.OWNER_REGEX)) {
      validationErrors.push(new ClientError(ClientErrorCode.INVALID_OWNER_CONTENT));
    }
  }
}
