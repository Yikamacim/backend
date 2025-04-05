import type { IValidator } from "../../app/interfaces/IValidator";
import { ClientError, ClientErrorCode } from "../../app/schemas/ClientError";
import { StringUtil } from "../../app/utils/StringUtil";
import { ItemRules } from "../rules/ItemRules";

export class ItemNameValidator implements IValidator {
  public static validate(data: string, validationErrors: ClientError[]): void {
    if (!StringUtil.isInLengthRange(data, ItemRules.NAME_MIN_LENGTH, ItemRules.NAME_MAX_LENGTH)) {
      validationErrors.push(new ClientError(ClientErrorCode.INVALID_ITEM_NAME_LENGTH));
    }
    if (!StringUtil.matchesRegex(data, ItemRules.NAME_REGEX)) {
      validationErrors.push(new ClientError(ClientErrorCode.INVALID_ITEM_NAME_CONTENT));
    }
  }
}
