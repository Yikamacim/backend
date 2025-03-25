import type { ParserResponse } from "../../../@types/responses";
import type { ExpressRequest } from "../../../@types/wrappers";
import type { IQueries } from "../../../app/interfaces/IQueries";
import { ClientError, ClientErrorCode } from "../../../app/schemas/ClientError";
import { ProtoUtil } from "../../../app/utils/ProtoUtil";
import { ResponseUtil } from "../../../app/utils/ResponseUtil";
import { StringUtil } from "../../../app/utils/StringUtil";

export class NeighbourhoodsQueries implements IQueries {
  private constructor(public readonly districtId: string) {}

  public static parse(req: ExpressRequest): ParserResponse<NeighbourhoodsQueries | null> {
    const preliminaryData: unknown = req.params["districtId"];
    // V1: Existence validation
    if (!ProtoUtil.isProtovalid(preliminaryData)) {
      return ResponseUtil.parserResponse([new ClientError(ClientErrorCode.MISSING_QUERY)], null);
    }
    const protovalidData: unknown = { districtId: preliminaryData };
    // V2: Schematic validation
    if (!NeighbourhoodsQueries.isBlueprint(protovalidData)) {
      return ResponseUtil.parserResponse([new ClientError(ClientErrorCode.INVALID_QUERY)], null);
    }
    const blueprintData: NeighbourhoodsQueries = protovalidData;
    // V3: Physical validation
    const clientErrors: ClientError[] = [];
    if (!StringUtil.isIntParsable(blueprintData.districtId)) {
      clientErrors.push(new ClientError(ClientErrorCode.INVALID_DISTRICT_ID));
    }
    const validatedData = blueprintData;
    // Return parser response
    return ResponseUtil.parserResponse(clientErrors, validatedData);
  }

  private static isBlueprint(data: unknown): data is NeighbourhoodsQueries {
    if (typeof data !== "object" || data === null) {
      return false;
    }
    const blueprint = data as NeighbourhoodsQueries;
    return typeof blueprint.districtId === "string";
  }
}
