import type { IParams } from "../../../../app/interfaces/IParams";
import { ClientError, ClientErrorCode } from "../../../../app/schemas/ClientError";
import { StringUtil } from "../../../../app/utils/StringUtil";

export class CountriesParams implements IParams {
  private constructor(public readonly countryId: string) {}

  public static isBlueprint(data: unknown): data is CountriesParams {
    if (typeof data !== "object" || data === null) {
      return false;
    }
    const blueprint = data as CountriesParams;
    return typeof blueprint.countryId === "string";
  }

  public static getValidationErrors(blueprintData: CountriesParams): ClientError[] {
    const validationErrors = new Array<ClientError>();
    if (!StringUtil.isIntParsable(blueprintData.countryId)) {
      validationErrors.push(new ClientError(ClientErrorCode.INVALID_COUNTRY_ID));
    }
    return validationErrors;
  }
}
