import type { ParserResponse } from "../../../../@types/responses";
import type { ExpressRequest } from "../../../../@types/wrappers";
import type { IParams } from "../../../../app/interfaces/IParams";
import { ClientError, ClientErrorCode } from "../../../../app/schemas/ClientError";
import { ProtoUtil } from "../../../../app/utils/ProtoUtil";
import { ResponseUtil } from "../../../../app/utils/ResponseUtil";
import { StringUtil } from "../../../../app/utils/StringUtil";

export class MyCarpetsParams implements IParams {
  private constructor(public readonly carpetId: string) {}

  public static parse(req: ExpressRequest): ParserResponse<MyCarpetsParams | null> {
    const preliminaryData: unknown = req.params["carpetId"];
    // V1: Existence validation
    if (!ProtoUtil.isProtovalid(preliminaryData)) {
      return ResponseUtil.parserResponse(
        [new ClientError(ClientErrorCode.MISSING_PARAMETER)],
        null,
      );
    }
    const protovalidData: unknown = { sessionId: preliminaryData };
    // V2: Schematic validation
    if (!MyCarpetsParams.isBlueprint(protovalidData)) {
      return ResponseUtil.parserResponse(
        [new ClientError(ClientErrorCode.INVALID_PARAMETER)],
        null,
      );
    }
    const blueprintData: MyCarpetsParams = protovalidData;
    // V3: Physical validation
    const clientErrors: ClientError[] = [];
    if (!StringUtil.isIntParsable(blueprintData.carpetId)) {
      clientErrors.push(new ClientError(ClientErrorCode.INVALID_CARPET_ID));
    }
    const validatedData = blueprintData;
    // Return parser response
    return ResponseUtil.parserResponse(clientErrors, validatedData);
  }

  private static isBlueprint(data: unknown): data is MyCarpetsParams {
    if (typeof data !== "object" || data === null) {
      return false;
    }
    const blueprint = data as MyCarpetsParams;
    return typeof blueprint.carpetId === "string";
  }
}
