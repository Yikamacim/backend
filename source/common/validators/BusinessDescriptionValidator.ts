import type { IValidator } from "../../app/interfaces/IValidator";
import { ClientError, ClientErrorCode } from "../../app/schemas/ClientError";
import { StringUtil } from "../../app/utils/StringUtil";
import { BusinessRules } from "../rules/BusinessRules";

export class BusinessDescriptionValidator implements IValidator {
  public static validate(data: string, validationErrors: ClientError[]): void {
    if (
      !StringUtil.isInLengthRange(
        data,
        BusinessRules.DESCRIPTION_MIN_LENGTH,
        BusinessRules.DESCRIPTION_MAX_LENGTH,
      )
    ) {
      validationErrors.push(new ClientError(ClientErrorCode.INVALID_BUSINESS_DESCRIPTION_LENGTH));
    }
    if (!StringUtil.matchesRegex(data, BusinessRules.DESCRIPTION_REGEX)) {
      validationErrors.push(new ClientError(ClientErrorCode.INVALID_BUSINESS_DESCRIPTION_CONTENT));
    }
  }
}
