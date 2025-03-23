import type { IParams } from "../../../../app/interfaces/IParams";
import { ClientError, ClientErrorCode } from "../../../../app/schemas/ClientError";
import { StringUtil } from "../../../../app/utils/StringUtil";

export class ProvincesParams implements IParams {
  private constructor(public readonly provinceId: string) {}

  public static isBlueprint(data: unknown): data is ProvincesParams {
    if (typeof data !== "object" || data === null) {
      return false;
    }
    const blueprint = data as ProvincesParams;
    return typeof blueprint.provinceId === "string";
  }

  public static getValidationErrors(blueprintData: ProvincesParams): ClientError[] {
    const validationErrors = new Array<ClientError>();
    if (!StringUtil.isIntParsable(blueprintData.provinceId)) {
      validationErrors.push(new ClientError(ClientErrorCode.INVALID_PROVINCE_ID));
    }
    return validationErrors;
  }
}
