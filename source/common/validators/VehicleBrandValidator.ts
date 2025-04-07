import type { IValidator } from "../../app/interfaces/IValidator";
import { ClientError, ClientErrorCode } from "../../app/schemas/ClientError";
import { StringUtil } from "../../app/utils/StringUtil";
import { VehicleRules } from "../rules/VehicleRules";

export class VehicleBrandValidator implements IValidator {
  public static validate(data: string, validationErrors: ClientError[]): void {
    if (
      !StringUtil.isInLengthRange(
        data,
        VehicleRules.BRAND_MIN_LENGTH,
        VehicleRules.BRAND_MAX_LENGTH,
      )
    ) {
      validationErrors.push(new ClientError(ClientErrorCode.INVALID_VEHICLE_BRAND_LENGTH));
    }
    if (!StringUtil.matchesRegex(data, VehicleRules.BRAND_REGEX)) {
      validationErrors.push(new ClientError(ClientErrorCode.INVALID_VEHICLE_BRAND_CONTENT));
    }
  }
}
