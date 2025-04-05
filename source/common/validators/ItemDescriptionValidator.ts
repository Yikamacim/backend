import type { IValidator } from "../../app/interfaces/IValidator";
import { ClientError, ClientErrorCode } from "../../app/schemas/ClientError";
import { StringUtil } from "../../app/utils/StringUtil";
import { ItemRules } from "../rules/ItemRules";

export class ItemDescriptionValidator implements IValidator {
  public static validate(data: string, validationErrors: ClientError[]): void {
    if (
      !StringUtil.isInLengthRange(
        data,
        ItemRules.DESCRIPTION_MIN_LENGTH,
        ItemRules.DESCRIPTION_MAX_LENGTH,
      )
    ) {
      validationErrors.push(new ClientError(ClientErrorCode.INVALID_ITEM_DESCRIPTION_LENGTH));
    }
    if (!StringUtil.matchesRegex(data, ItemRules.DESCRIPTION_REGEX)) {
      validationErrors.push(new ClientError(ClientErrorCode.INVALID_ITEM_DESCRIPTION_CONTENT));
    }
  }
}
