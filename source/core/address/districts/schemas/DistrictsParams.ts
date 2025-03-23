import type { IParams } from "../../../../app/interfaces/IParams";
import { ClientError, ClientErrorCode } from "../../../../app/schemas/ClientError";
import { StringUtil } from "../../../../app/utils/StringUtil";

export class DistrictsParams implements IParams {
  private constructor(public readonly districtId: string) {}

  public static isBlueprint(data: unknown): data is DistrictsParams {
    if (typeof data !== "object" || data === null) {
      return false;
    }
    const blueprint = data as DistrictsParams;
    return typeof blueprint.districtId === "string";
  }

  public static getValidationErrors(blueprintData: DistrictsParams): ClientError[] {
    const validationErrors = new Array<ClientError>();
    if (!StringUtil.isIntParsable(blueprintData.districtId)) {
      validationErrors.push(new ClientError(ClientErrorCode.INVALID_DISTRICT_ID));
    }
    return validationErrors;
  }
}
