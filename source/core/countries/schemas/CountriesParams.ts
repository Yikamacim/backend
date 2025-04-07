import type { ParserResponse } from "../../../@types/responses";
import type { ExpressRequest } from "../../../@types/wrappers";
import type { IParams } from "../../../app/interfaces/IParams";
import { ClientError, ClientErrorCode } from "../../../app/schemas/ClientError";
import { ProtoUtil } from "../../../app/utils/ProtoUtil";
import { ResponseUtil } from "../../../app/utils/ResponseUtil";
import { StringUtil } from "../../../app/utils/StringUtil";

export class CountriesParams implements IParams {
  private constructor(public readonly countryId: string) {}

  public static parse(req: ExpressRequest): ParserResponse<CountriesParams | null> {
    const preliminaryData: unknown = req.params["countryId"];
    // >----------< EXISTENCE VALIDATION >----------<
    if (!ProtoUtil.isProtovalid(preliminaryData)) {
      return ResponseUtil.parserResponse(
        [new ClientError(ClientErrorCode.MISSING_PARAMETER)],
        null,
      );
    }
    const protovalidData: unknown = { countryId: preliminaryData };
    // >----------< SCHEMATIC VALIDATION >----------<
    if (!CountriesParams.isBlueprint(protovalidData)) {
      return ResponseUtil.parserResponse(
        [new ClientError(ClientErrorCode.INVALID_PARAMETER)],
        null,
      );
    }
    const blueprintData: CountriesParams = protovalidData;
    // >----------< PHYSICAL VALIDATION >----------<
    const clientErrors: ClientError[] = [];
    if (!StringUtil.isIntParsable(blueprintData.countryId)) {
      clientErrors.push(new ClientError(ClientErrorCode.INVALID_COUNTRY_ID));
    }
    const validatedData = blueprintData;
    // >----------< RETURN >----------<
    return ResponseUtil.parserResponse(clientErrors, validatedData);
  }

  private static isBlueprint(data: unknown): data is CountriesParams {
    if (typeof data !== "object" || data === null) {
      return false;
    }
    const blueprint = data as CountriesParams;
    return typeof blueprint.countryId === "string";
  }
}
