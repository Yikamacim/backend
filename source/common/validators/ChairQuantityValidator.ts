import type { IValidator } from "../../app/interfaces/IValidator";
import { ClientError, ClientErrorCode } from "../../app/schemas/ClientError";
import { NumberUtil } from "../../app/utils/NumberUtil";
import { ChairRules } from "../rules/ChairRules";

export class ChairQuantityValidator implements IValidator {
  public static validate(data: number, validationErrors: ClientError[]): void {
    if (!NumberUtil.isInRange(data, ChairRules.QUANTITY_MIN, ChairRules.QUANTITY_MAX)) {
      validationErrors.push(new ClientError(ClientErrorCode.INVALID_CHAIR_QUANTITY));
    }
  }
}
