import type { IParams } from "../../../../app/interfaces/IParams";
import { ClientError, ClientErrorCode } from "../../../../app/schemas/ClientError";
import { StringUtil } from "../../../../app/utils/StringUtil";

export class ProvincesQueries implements IParams {
  private constructor(public readonly countryId: string) {}

  public static isBlueprint(data: unknown): data is ProvincesQueries {
    if (typeof data !== "object" || data === null) {
      return false;
    }
    const blueprint = data as ProvincesQueries;
    return typeof blueprint.countryId === "string";
  }

  public static getValidationErrors(blueprintData: ProvincesQueries): ClientError[] {
    const validationErrors = new Array<ClientError>();
    if (!StringUtil.isIntParsable(blueprintData.countryId)) {
      validationErrors.push(new ClientError(ClientErrorCode.INVALID_COUNTRY_ID_FOR_PROVINCE));
    }
    return validationErrors;
  }
}
