import type { ParserResponse } from "../../../@types/responses";
import type { ExpressRequest } from "../../../@types/wrappers";
import type { IQueries } from "../../../app/interfaces/IQueries";
import { ClientError, ClientErrorCode } from "../../../app/schemas/ClientError";
import { ProtoUtil } from "../../../app/utils/ProtoUtil";
import { ResponseUtil } from "../../../app/utils/ResponseUtil";
import { StringUtil } from "../../../app/utils/StringUtil";

export class NeighborhoodsQueries implements IQueries {
  private constructor(public readonly districtId: string) {}

  public static parse(req: ExpressRequest): ParserResponse<NeighborhoodsQueries | null> {
    const preliminaryData: unknown = req.query["districtId"];
    // >----------< EXISTENCE VALIDATION >----------<
    if (!ProtoUtil.isProtovalid(preliminaryData)) {
      return ResponseUtil.parserResponse([new ClientError(ClientErrorCode.MISSING_QUERY)], null);
    }
    const protovalidData: unknown = { districtId: preliminaryData };
    // >----------< SCHEMATIC VALIDATION >----------<
    if (!NeighborhoodsQueries.isBlueprint(protovalidData)) {
      return ResponseUtil.parserResponse([new ClientError(ClientErrorCode.INVALID_QUERY)], null);
    }
    const blueprintData: NeighborhoodsQueries = protovalidData;
    // >----------< PHYSICAL VALIDATION >----------<
    const clientErrors: ClientError[] = [];
    if (!StringUtil.isIntParsable(blueprintData.districtId)) {
      clientErrors.push(new ClientError(ClientErrorCode.INVALID_DISTRICT_ID));
    }
    const validatedData = blueprintData;
    // >----------< RETURN >----------<
    return ResponseUtil.parserResponse(clientErrors, validatedData);
  }

  private static isBlueprint(data: unknown): data is NeighborhoodsQueries {
    if (typeof data !== "object" || data === null) {
      return false;
    }
    const blueprint = data as NeighborhoodsQueries;
    return typeof blueprint.districtId === "string";
  }
}
