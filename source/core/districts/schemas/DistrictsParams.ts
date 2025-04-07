import type { ParserResponse } from "../../../@types/responses";
import type { ExpressRequest } from "../../../@types/wrappers";
import type { IParams } from "../../../app/interfaces/IParams";
import { ClientError, ClientErrorCode } from "../../../app/schemas/ClientError";
import { ProtoUtil } from "../../../app/utils/ProtoUtil";
import { ResponseUtil } from "../../../app/utils/ResponseUtil";
import { StringUtil } from "../../../app/utils/StringUtil";

export class DistrictsParams implements IParams {
  private constructor(public readonly districtId: string) {}

  public static parse(req: ExpressRequest): ParserResponse<DistrictsParams | null> {
    const preliminaryData: unknown = req.params["districtId"];
    // >----------< EXISTENCE VALIDATION >----------<
    if (!ProtoUtil.isProtovalid(preliminaryData)) {
      return ResponseUtil.parserResponse(
        [new ClientError(ClientErrorCode.MISSING_PARAMETER)],
        null,
      );
    }
    const protovalidData: unknown = { districtId: preliminaryData };
    // >----------< SCHEMATIC VALIDATION >----------<
    if (!DistrictsParams.isBlueprint(protovalidData)) {
      return ResponseUtil.parserResponse(
        [new ClientError(ClientErrorCode.INVALID_PARAMETER)],
        null,
      );
    }
    const blueprintData: DistrictsParams = protovalidData;
    // >----------< PHYSICAL VALIDATION >----------<
    const clientErrors: ClientError[] = [];
    if (!StringUtil.isIntParsable(blueprintData.districtId)) {
      clientErrors.push(new ClientError(ClientErrorCode.INVALID_DISTRICT_ID));
    }
    const validatedData = blueprintData;
    // >----------< RETURN >----------<
    return ResponseUtil.parserResponse(clientErrors, validatedData);
  }

  private static isBlueprint(data: unknown): data is DistrictsParams {
    if (typeof data !== "object" || data === null) {
      return false;
    }
    const blueprint = data as DistrictsParams;
    return typeof blueprint.districtId === "string";
  }
}
