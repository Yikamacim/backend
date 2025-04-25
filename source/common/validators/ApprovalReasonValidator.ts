import type { IValidator } from "../../app/interfaces/IValidator";
import { ClientError, ClientErrorCode } from "../../app/schemas/ClientError";
import { StringUtil } from "../../app/utils/StringUtil";
import { ApprovalRules } from "../rules/ApprovalRules";

export class ApprovalReasonValidator implements IValidator {
  public static validate(data: string, validationErrors: ClientError[]): void {
    if (
      !StringUtil.isInLengthRange(
        data,
        ApprovalRules.REASON_MIN_LENGTH,
        ApprovalRules.REASON_MAX_LENGTH,
      )
    ) {
      validationErrors.push(new ClientError(ClientErrorCode.INVALID_APPROVAL_REASON_LENGTH));
    }
    if (!StringUtil.matchesRegex(data, ApprovalRules.REASON_REGEX)) {
      validationErrors.push(new ClientError(ClientErrorCode.INVALID_APPROVAL_REASON_CONTENT));
    }
  }
}
