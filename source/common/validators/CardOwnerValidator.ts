import type { IValidator } from "../../app/interfaces/IValidator";
import { ClientError, ClientErrorCode } from "../../app/schemas/ClientError";
import { StringUtil } from "../../app/utils/StringUtil";
import { CardRules } from "../rules/CardRules";

export class CardOwnerValidator implements IValidator {
  public static validate(data: string, validationErrors: ClientError[]): void {
    if (!StringUtil.isInLengthRange(data, CardRules.OWNER_MIN_LENGTH, CardRules.OWNER_MAX_LENGTH)) {
      validationErrors.push(new ClientError(ClientErrorCode.INVALID_CARD_OWNER_LENGTH));
    }
    if (!StringUtil.matchesRegex(data, CardRules.NAME_REGEX)) {
      validationErrors.push(new ClientError(ClientErrorCode.INVALID_CARD_OWNER_CONTENT));
    }
  }
}
