import type { IValidator } from "../../app/interfaces/IValidator";
import { ClientError, ClientErrorCode } from "../../app/schemas/ClientError";
import { StringUtil } from "../../app/utils/StringUtil";
import { VehicleRules } from "../rules/VehicleRules";

export class VehicleModelValidator implements IValidator {
  public static validate(data: string, validationErrors: ClientError[]): void {
    if (
      !StringUtil.isInLengthRange(
        data,
        VehicleRules.MODEL_MIN_LENGTH,
        VehicleRules.MODEL_MAX_LENGTH,
      )
    ) {
      validationErrors.push(new ClientError(ClientErrorCode.INVALID_VEHICLE_MODEL_LENGTH));
    }
    if (!StringUtil.matchesRegex(data, VehicleRules.MODEL_REGEX)) {
      validationErrors.push(new ClientError(ClientErrorCode.INVALID_VEHICLE_MODEL_CONTENT));
    }
  }
}
