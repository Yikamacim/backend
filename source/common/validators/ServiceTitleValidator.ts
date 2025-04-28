import type { IValidator } from "../../app/interfaces/IValidator";
import { ClientError, ClientErrorCode } from "../../app/schemas/ClientError";
import { StringUtil } from "../../app/utils/StringUtil";
import { ServiceRules } from "../rules/ServiceRules";

export class ServiceTitleValidator implements IValidator {
  public static validate(data: string, validationErrors: ClientError[]): void {
    if (
      !StringUtil.isInLengthRange(
        data,
        ServiceRules.TITLE_MIN_LENGTH,
        ServiceRules.TITLE_MAX_LENGTH,
      )
    ) {
      validationErrors.push(new ClientError(ClientErrorCode.INVALID_SERVICE_TITLE_LENGTH));
    }
    if (!StringUtil.matchesRegex(data, ServiceRules.TITLE_REGEX)) {
      validationErrors.push(new ClientError(ClientErrorCode.INVALID_SERVICE_TITLE_CONTENT));
    }
  }
}
