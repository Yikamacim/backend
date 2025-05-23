import type { IValidator } from "../../app/interfaces/IValidator";
import { ClientError, ClientErrorCode } from "../../app/schemas/ClientError";
import { StringUtil } from "../../app/utils/StringUtil";
import { CardRules } from "../rules/CardRules";

export class CardNameValidator implements IValidator {
  public static validate(data: string, validationErrors: ClientError[]): void {
    if (!StringUtil.isInLengthRange(data, CardRules.NAME_MIN_LENGTH, CardRules.NAME_MAX_LENGTH)) {
      validationErrors.push(new ClientError(ClientErrorCode.INVALID_CARD_NAME_LENGTH));
    }
    if (!StringUtil.matchesRegex(data, CardRules.NAME_REGEX)) {
      validationErrors.push(new ClientError(ClientErrorCode.INVALID_CARD_NAME_CONTENT));
    }
  }
}
