import type { IValidator } from "../../app/interfaces/IValidator";
import { ClientError, ClientErrorCode } from "../../app/schemas/ClientError";
import { StringUtil } from "../../app/utils/StringUtil";
import { BankRules } from "../rules/BankRules";

export class IbanValidator implements IValidator {
  public static validate(data: string, validationErrors: ClientError[]): void {
    if (!StringUtil.isInLengthRange(data, BankRules.IBAN_MIN_LENGTH, BankRules.IBAN_MAX_LENGTH)) {
      validationErrors.push(new ClientError(ClientErrorCode.INVALID_IBAN_LENGTH));
    }
    if (!StringUtil.matchesRegex(data, BankRules.IBAN_REGEX)) {
      validationErrors.push(new ClientError(ClientErrorCode.INVALID_IBAN_CONTENT));
    }
  }
}
