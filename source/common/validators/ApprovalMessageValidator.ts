import type { IValidator } from "../../app/interfaces/IValidator";
import { ClientError, ClientErrorCode } from "../../app/schemas/ClientError";
import { StringUtil } from "../../app/utils/StringUtil";
import { ApprovalRules } from "../rules/ApprovalRules";

export class ApprovalMessageValidator implements IValidator {
  public static validate(data: string, validationErrors: ClientError[]): void {
    if (
      !StringUtil.isInLengthRange(
        data,
        ApprovalRules.MESSAGE_MIN_LENGTH,
        ApprovalRules.MESSAGE_MAX_LENGTH,
      )
    ) {
      validationErrors.push(new ClientError(ClientErrorCode.INVALID_APPROVAL_MESSAGE_LENGTH));
    }
    if (!StringUtil.matchesRegex(data, ApprovalRules.MESSAGE_REGEX)) {
      validationErrors.push(new ClientError(ClientErrorCode.INVALID_APPROVAL_MESSAGE_CONTENT));
    }
  }
}
