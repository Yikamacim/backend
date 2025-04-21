import type { IValidator } from "../../app/interfaces/IValidator";
import { ClientError, ClientErrorCode } from "../../app/schemas/ClientError";
import { StringUtil } from "../../app/utils/StringUtil";
import { BusinessRules } from "../rules/BusinessRules";

export class BusinessNameValidator implements IValidator {
  public static validate(data: string, validationErrors: ClientError[]): void {
    if (
      !StringUtil.isInLengthRange(
        data,
        BusinessRules.NAME_MIN_LENGTH,
        BusinessRules.NAME_MAX_LENGTH,
      )
    ) {
      validationErrors.push(new ClientError(ClientErrorCode.INVALID_BUSINESS_NAME_LENGTH));
    }
    if (!StringUtil.matchesRegex(data, BusinessRules.NAME_REGEX)) {
      validationErrors.push(new ClientError(ClientErrorCode.INVALID_BUSINESS_NAME_CONTENT));
    }
  }
}
