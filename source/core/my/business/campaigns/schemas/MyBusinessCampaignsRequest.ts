import type { ParserResponse } from "../../../../../@types/responses";
import type { ExpressRequest } from "../../../../../@types/wrappers";
import type { IRequest } from "../../../../../app/interfaces/IRequest";
import { ClientError, ClientErrorCode } from "../../../../../app/schemas/ClientError";
import { ProtoUtil } from "../../../../../app/utils/ProtoUtil";
import { ResponseUtil } from "../../../../../app/utils/ResponseUtil";
import { CampaignDescriptionValidator } from "../../../../../common/validators/CampaignDescriptionValidator";
import { CampaignTitleValidator } from "../../../../../common/validators/CampaignTitleValidator";

export class MyBusinessCampaignsRequest implements IRequest {
  public constructor(
    public readonly title: string,
    public readonly mediaId: number,
    public readonly description: string,
  ) {}

  public static parse(req: ExpressRequest): ParserResponse<MyBusinessCampaignsRequest | null> {
    const preliminaryData: unknown = req.body;
    // >----------< EXISTENCE VALIDATION >----------<
    if (!ProtoUtil.isProtovalid(preliminaryData)) {
      return ResponseUtil.parserResponse([new ClientError(ClientErrorCode.MISSING_BODY)], null);
    }
    const protovalidData: unknown = preliminaryData;
    // >----------< SCHEMATIC VALIDATION >----------<
    if (!MyBusinessCampaignsRequest.isBlueprint(protovalidData)) {
      return ResponseUtil.parserResponse([new ClientError(ClientErrorCode.INVALID_BODY)], null);
    }
    const blueprintData: MyBusinessCampaignsRequest = protovalidData;
    // >----------< PHYSICAL VALIDATION >----------<
    const clientErrors: ClientError[] = [];
    CampaignTitleValidator.validate(blueprintData.title, clientErrors);
    CampaignDescriptionValidator.validate(blueprintData.description, clientErrors);
    const validatedData = blueprintData;
    // >----------< RETURN >----------<
    return ResponseUtil.parserResponse(clientErrors, validatedData);
  }

  private static isBlueprint(obj: unknown): obj is MyBusinessCampaignsRequest {
    if (typeof obj !== "object" || obj === null) {
      return false;
    }
    const blueprint = obj as MyBusinessCampaignsRequest;
    return (
      typeof blueprint.mediaId === "number" &&
      typeof blueprint.title === "string" &&
      typeof blueprint.description === "string"
    );
  }
}
