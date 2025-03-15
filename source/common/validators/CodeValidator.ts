import type { IValidator } from "../../app/interfaces/IValidator";
import { ClientError, ClientErrorCode } from "../../app/schemas/ClientError";
import { StringUtil } from "../../app/utils/StringUtil";
import { VerificationRules } from "../rules/VerificationRules";

export class CodeValidator implements IValidator {
  public static validate(data: string, validationErrors: ClientError[]): void {
    if (data.length !== VerificationRules.CODE_LENGTH) {
      validationErrors.push(new ClientError(ClientErrorCode.INVALID_CODE_LENGTH));
    }
    if (!StringUtil.matchesRegex(data, VerificationRules.CODE_REGEX)) {
      validationErrors.push(new ClientError(ClientErrorCode.INVALID_CODE_CONTENT));
    }
  }
}
