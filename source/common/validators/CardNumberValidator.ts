import type { IValidator } from "../../app/interfaces/IValidator";
import { ClientError, ClientErrorCode } from "../../app/schemas/ClientError";
import { StringUtil } from "../../app/utils/StringUtil";
import { CardRules } from "../rules/CardRules";

export class CardNumberValidator implements IValidator {
  public static validate(data: string, validationErrors: ClientError[]): void {
    if (data.length !== CardRules.NUMBER_LENGTH) {
      validationErrors.push(new ClientError(ClientErrorCode.INVALID_CARD_NUMBER_LENGTH));
    }
    if (!StringUtil.matchesRegex(data, CardRules.NUMBER_REGEX)) {
      validationErrors.push(new ClientError(ClientErrorCode.INVALID_CARD_NUMBER_CONTENT));
    }
  }
}
