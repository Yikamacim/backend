import type { ParserResponse } from "../../../@types/responses";
import type { ExpressRequest } from "../../../@types/wrappers";
import type { IParams } from "../../../app/interfaces/IParams";
import { ClientError, ClientErrorCode } from "../../../app/schemas/ClientError";
import { ProtoUtil } from "../../../app/utils/ProtoUtil";
import { ResponseUtil } from "../../../app/utils/ResponseUtil";
import { StringUtil } from "../../../app/utils/StringUtil";

export class ProvincesParams implements IParams {
  private constructor(public readonly provinceId: string) {}

  public static parse(req: ExpressRequest): ParserResponse<ProvincesParams | null> {
    const preliminaryData: unknown = req.params["provinceId"];
    // V1: Existence validation
    if (!ProtoUtil.isProtovalid(preliminaryData)) {
      return ResponseUtil.parserResponse(
        [new ClientError(ClientErrorCode.MISSING_PARAMETER)],
        null,
      );
    }
    const protovalidData: unknown = { provinceId: preliminaryData };
    // V2: Schematic validation
    if (!ProvincesParams.isBlueprint(protovalidData)) {
      return ResponseUtil.parserResponse(
        [new ClientError(ClientErrorCode.INVALID_PARAMETER)],
        null,
      );
    }
    const blueprintData: ProvincesParams = protovalidData;
    // V3: Physical validation
    const clientErrors: ClientError[] = [];
    if (!StringUtil.isIntParsable(blueprintData.provinceId)) {
      clientErrors.push(new ClientError(ClientErrorCode.INVALID_PROVINCE_ID));
    }
    const validatedData = blueprintData;
    // Return parser response
    return ResponseUtil.parserResponse(clientErrors, validatedData);
  }

  private static isBlueprint(data: unknown): data is ProvincesParams {
    if (typeof data !== "object" || data === null) {
      return false;
    }
    const blueprint = data as ProvincesParams;
    return typeof blueprint.provinceId === "string";
  }
}
