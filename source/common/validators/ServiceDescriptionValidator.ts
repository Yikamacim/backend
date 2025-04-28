import type { IValidator } from "../../app/interfaces/IValidator";
import { ClientError, ClientErrorCode } from "../../app/schemas/ClientError";
import { StringUtil } from "../../app/utils/StringUtil";
import { ServiceRules } from "../rules/ServiceRules";

export class ServiceDescriptionValidator implements IValidator {
  public static validate(data: string, validationErrors: ClientError[]): void {
    if (
      !StringUtil.isInLengthRange(
        data,
        ServiceRules.DESCRIPTION_MIN_LENGTH,
        ServiceRules.DESCRIPTION_MAX_LENGTH,
      )
    ) {
      validationErrors.push(new ClientError(ClientErrorCode.INVALID_SERVICE_DESCRIPTION_LENGTH));
    }
    if (!StringUtil.matchesRegex(data, ServiceRules.TITLE_REGEX)) {
      validationErrors.push(new ClientError(ClientErrorCode.INVALID_SERVICE_DESCRIPTION_CONTENT));
    }
  }
}
