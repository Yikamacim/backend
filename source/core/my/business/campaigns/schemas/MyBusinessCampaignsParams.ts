import type { ParserResponse } from "../../../../../@types/responses";
import type { ExpressRequest } from "../../../../../@types/wrappers";
import type { IParams } from "../../../../../app/interfaces/IParams";
import { ClientError, ClientErrorCode } from "../../../../../app/schemas/ClientError";
import { ProtoUtil } from "../../../../../app/utils/ProtoUtil";
import { ResponseUtil } from "../../../../../app/utils/ResponseUtil";
import { StringUtil } from "../../../../../app/utils/StringUtil";

export class MyBusinessCampaignsParams implements IParams {
  private constructor(public readonly campaignId: string) {}

  public static parse(req: ExpressRequest): ParserResponse<MyBusinessCampaignsParams | null> {
    const preliminaryData: unknown = req.params["campaignId"];
    // >----------< EXISTENCE VALIDATION >----------<
    if (!ProtoUtil.isProtovalid(preliminaryData)) {
      return ResponseUtil.parserResponse(
        [new ClientError(ClientErrorCode.MISSING_PARAMETER)],
        null,
      );
    }
    const protovalidData: unknown = { campaignId: preliminaryData };
    // >----------< SCHEMATIC VALIDATION >----------<
    if (!MyBusinessCampaignsParams.isBlueprint(protovalidData)) {
      return ResponseUtil.parserResponse(
        [new ClientError(ClientErrorCode.INVALID_PARAMETER)],
        null,
      );
    }
    const blueprintData: MyBusinessCampaignsParams = protovalidData;
    // >----------< PHYSICAL VALIDATION >----------<
    const clientErrors: ClientError[] = [];
    if (!StringUtil.isIntParsable(blueprintData.campaignId)) {
      clientErrors.push(new ClientError(ClientErrorCode.INVALID_CAMPAIGN_ID));
    }
    const validatedData = blueprintData;
    // >----------< RETURN >----------<
    return ResponseUtil.parserResponse(clientErrors, validatedData);
  }

  private static isBlueprint(data: unknown): data is MyBusinessCampaignsParams {
    if (typeof data !== "object" || data === null) {
      return false;
    }
    const blueprint = data as MyBusinessCampaignsParams;
    return typeof blueprint.campaignId === "string";
  }
}
