import type { IValidator } from "../../app/interfaces/IValidator";
import { ClientError, ClientErrorCode } from "../../app/schemas/ClientError";
import { StringUtil } from "../../app/utils/StringUtil";
import { BusinessRules } from "../rules/BusinessRules";

export class BusinessHourValidator implements IValidator {
  public static validate(data: string, validationErrors: ClientError[]): void {
    if (data.length !== BusinessRules.HOUR_LENGTH) {
      validationErrors.push(new ClientError(ClientErrorCode.INVALID_BUSINESS_HOUR_LENGTH));
    }
    if (!StringUtil.matchesRegex(data, BusinessRules.HOUR_REGEX)) {
      validationErrors.push(new ClientError(ClientErrorCode.INVALID_BUSINESS_HOUR_CONTENT));
    }
  }
}
