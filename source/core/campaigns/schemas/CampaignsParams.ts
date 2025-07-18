import type { ParserResponse } from "../../../@types/responses";
import type { ExpressRequest } from "../../../@types/wrappers";
import type { IParams } from "../../../app/interfaces/IParams";
import { ClientError, ClientErrorCode } from "../../../app/schemas/ClientError";
import { ProtoUtil } from "../../../app/utils/ProtoUtil";
import { ResponseUtil } from "../../../app/utils/ResponseUtil";
import { StringUtil } from "../../../app/utils/StringUtil";

export class CampaignsParams implements IParams {
  private constructor(public readonly neighborhoodId: string) {}

  public static parse(req: ExpressRequest): ParserResponse<CampaignsParams | null> {
    const preliminaryData: unknown = req.params["neighborhoodId"];
    // >----------< EXISTENCE VALIDATION >----------<
    if (!ProtoUtil.isProtovalid(preliminaryData)) {
      return ResponseUtil.parserResponse(
        [new ClientError(ClientErrorCode.MISSING_PARAMETER)],
        null,
      );
    }
    const protovalidData: unknown = { neighborhoodId: preliminaryData };
    // >----------< SCHEMATIC VALIDATION >----------<
    if (!CampaignsParams.isBlueprint(protovalidData)) {
      return ResponseUtil.parserResponse(
        [new ClientError(ClientErrorCode.INVALID_PARAMETER)],
        null,
      );
    }
    const blueprintData: CampaignsParams = protovalidData;
    // >----------< PHYSICAL VALIDATION >----------<
    const clientErrors: ClientError[] = [];
    if (!StringUtil.isIntParsable(blueprintData.neighborhoodId)) {
      clientErrors.push(new ClientError(ClientErrorCode.INVALID_NEIGHBORHOOD_ID));
    }
    const validatedData = blueprintData;
    // >----------< RETURN >----------<
    return ResponseUtil.parserResponse(clientErrors, validatedData);
  }

  private static isBlueprint(data: unknown): data is CampaignsParams {
    if (typeof data !== "object" || data === null) {
      return false;
    }
    const blueprint = data as CampaignsParams;
    return typeof blueprint.neighborhoodId === "string";
  }
}
