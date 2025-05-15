import type { ParserResponse } from "../../../../@types/responses";
import type { ExpressRequest } from "../../../../@types/wrappers";
import type { IParams } from "../../../../app/interfaces/IParams";
import { ClientError, ClientErrorCode } from "../../../../app/schemas/ClientError";
import { ProtoUtil } from "../../../../app/utils/ProtoUtil";
import { ResponseUtil } from "../../../../app/utils/ResponseUtil";
import { StringUtil } from "../../../../app/utils/StringUtil";

export class BusinessesAboutParams implements IParams {
  private constructor(public readonly businessId: string) {}

  public static parse(req: ExpressRequest): ParserResponse<BusinessesAboutParams | null> {
    const preliminaryData: unknown = req.params["businessId"];
    // >----------< EXISTENCE VALIDATION >----------<
    if (!ProtoUtil.isProtovalid(preliminaryData)) {
      return ResponseUtil.parserResponse(
        [new ClientError(ClientErrorCode.MISSING_PARAMETER)],
        null,
      );
    }
    const protovalidData: unknown = { businessId: preliminaryData };
    // >----------< SCHEMATIC VALIDATION >----------<
    if (!BusinessesAboutParams.isBlueprint(protovalidData)) {
      return ResponseUtil.parserResponse(
        [new ClientError(ClientErrorCode.INVALID_PARAMETER)],
        null,
      );
    }
    const blueprintData: BusinessesAboutParams = protovalidData;
    // >----------< PHYSICAL VALIDATION >----------<
    const clientErrors: ClientError[] = [];
    if (!StringUtil.isIntParsable(blueprintData.businessId)) {
      clientErrors.push(new ClientError(ClientErrorCode.INVALID_BUSINESS_ID));
    }
    const validatedData = blueprintData;
    // >----------< RETURN >----------<
    return ResponseUtil.parserResponse(clientErrors, validatedData);
  }

  private static isBlueprint(data: unknown): data is BusinessesAboutParams {
    if (typeof data !== "object" || data === null) {
      return false;
    }
    const blueprint = data as BusinessesAboutParams;
    return typeof blueprint.businessId === "string";
  }
}
