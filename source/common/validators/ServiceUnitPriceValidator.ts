import type { IValidator } from "../../app/interfaces/IValidator";
import { ClientError, ClientErrorCode } from "../../app/schemas/ClientError";
import { NumberUtil } from "../../app/utils/NumberUtil";
import { ServiceRules } from "../rules/ServiceRules";

export class ServiceUnitPriceValidator implements IValidator {
  public static validate(data: number, validationErrors: ClientError[]): void {
    if (!NumberUtil.isInRange(data, ServiceRules.UNIT_PRICE_MIN, ServiceRules.UNIT_PRICE_MAX)) {
      validationErrors.push(new ClientError(ClientErrorCode.INVALID_SERVICE_UNIT_PRICE));
    }
  }
}
