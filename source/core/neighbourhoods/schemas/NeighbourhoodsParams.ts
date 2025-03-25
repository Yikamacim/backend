import type { ParserResponse } from "../../../@types/responses";
import type { ExpressRequest } from "../../../@types/wrappers";
import type { IParams } from "../../../app/interfaces/IParams";
import { ClientError, ClientErrorCode } from "../../../app/schemas/ClientError";
import { ProtoUtil } from "../../../app/utils/ProtoUtil";
import { ResponseUtil } from "../../../app/utils/ResponseUtil";
import { StringUtil } from "../../../app/utils/StringUtil";

export class NeighbourhoodsParams implements IParams {
  private constructor(public readonly neighbourhoodId: string) {}

  public static parse(req: ExpressRequest): ParserResponse<NeighbourhoodsParams | null> {
    const preliminaryData: unknown = req.params["neighbourhoodId"];
    // V1: Existence validation
    if (!ProtoUtil.isProtovalid(preliminaryData)) {
      return ResponseUtil.parserResponse(
        [new ClientError(ClientErrorCode.MISSING_PARAMETER)],
        null,
      );
    }
    const protovalidData: unknown = { neighbourhoodId: preliminaryData };
    // V2: Schematic validation
    if (!NeighbourhoodsParams.isBlueprint(protovalidData)) {
      return ResponseUtil.parserResponse(
        [new ClientError(ClientErrorCode.INVALID_PARAMETER)],
        null,
      );
    }
    const blueprintData: NeighbourhoodsParams = protovalidData;
    // V3: Physical validation
    const clientErrors: ClientError[] = [];
    if (!StringUtil.isIntParsable(blueprintData.neighbourhoodId)) {
      clientErrors.push(new ClientError(ClientErrorCode.INVALID_NEIGHBOURHOOD_ID));
    }
    const validatedData = blueprintData;
    // Return parser response
    return ResponseUtil.parserResponse(clientErrors, validatedData);
  }

  private static isBlueprint(data: unknown): data is NeighbourhoodsParams {
    if (typeof data !== "object" || data === null) {
      return false;
    }
    const blueprint = data as NeighbourhoodsParams;
    return typeof blueprint.neighbourhoodId === "string";
  }
}
