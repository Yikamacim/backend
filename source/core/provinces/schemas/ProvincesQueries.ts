import type { ParserResponse } from "../../../@types/responses";
import type { ExpressRequest } from "../../../@types/wrappers";
import type { IQueries } from "../../../app/interfaces/IQueries";
import { ClientError, ClientErrorCode } from "../../../app/schemas/ClientError";
import { ProtoUtil } from "../../../app/utils/ProtoUtil";
import { ResponseUtil } from "../../../app/utils/ResponseUtil";
import { StringUtil } from "../../../app/utils/StringUtil";

export class ProvincesQueries implements IQueries {
  private constructor(public readonly countryId: string) {}

  public static parse(req: ExpressRequest): ParserResponse<ProvincesQueries | null> {
    const preliminaryData: unknown = req.query["countryId"];
    // V1: Existence validation
    if (!ProtoUtil.isProtovalid(preliminaryData)) {
      return ResponseUtil.parserResponse([new ClientError(ClientErrorCode.MISSING_QUERY)], null);
    }
    const protovalidData: unknown = { countryId: preliminaryData };
    // V2: Schematic validation
    if (!ProvincesQueries.isBlueprint(protovalidData)) {
      return ResponseUtil.parserResponse([new ClientError(ClientErrorCode.INVALID_QUERY)], null);
    }
    const blueprintData: ProvincesQueries = protovalidData;
    // V3: Physical validation
    const clientErrors: ClientError[] = [];
    if (!StringUtil.isIntParsable(blueprintData.countryId)) {
      clientErrors.push(new ClientError(ClientErrorCode.INVALID_COUNTRY_ID));
    }
    const validatedData = blueprintData;
    // Return parser response
    return ResponseUtil.parserResponse(clientErrors, validatedData);
  }

  private static isBlueprint(data: unknown): data is ProvincesQueries {
    if (typeof data !== "object" || data === null) {
      return false;
    }
    const blueprint = data as ProvincesQueries;
    return typeof blueprint.countryId === "string";
  }
}
