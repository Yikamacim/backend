import type { ParserResponse } from "../../../../@types/responses";
import type { ExpressRequest } from "../../../../@types/wrappers";
import type { IParams } from "../../../../app/interfaces/IParams";
import { ClientError, ClientErrorCode } from "../../../../app/schemas/ClientError";
import { ProtoUtil } from "../../../../app/utils/ProtoUtil";
import { ResponseUtil } from "../../../../app/utils/ResponseUtil";
import { StringUtil } from "../../../../app/utils/StringUtil";

export class MyCurtainsParams implements IParams {
  private constructor(public readonly curtainId: string) {}

  public static parse(req: ExpressRequest): ParserResponse<MyCurtainsParams | null> {
    const preliminaryData: unknown = req.params["curtainId"];
    // >----------< EXISTENCE VALIDATION >----------<
    if (!ProtoUtil.isProtovalid(preliminaryData)) {
      return ResponseUtil.parserResponse(
        [new ClientError(ClientErrorCode.MISSING_PARAMETER)],
        null,
      );
    }
    const protovalidData: unknown = { curtainId: preliminaryData };
    // >----------< SCHEMATIC VALIDATION >----------<
    if (!MyCurtainsParams.isBlueprint(protovalidData)) {
      return ResponseUtil.parserResponse(
        [new ClientError(ClientErrorCode.INVALID_PARAMETER)],
        null,
      );
    }
    const blueprintData: MyCurtainsParams = protovalidData;
    // >----------< PHYSICAL VALIDATION >----------<
    const clientErrors: ClientError[] = [];
    if (!StringUtil.isIntParsable(blueprintData.curtainId)) {
      clientErrors.push(new ClientError(ClientErrorCode.INVALID_CURTAIN_ID));
    }
    const validatedData = blueprintData;
    // >----------< RETURN >----------<
    return ResponseUtil.parserResponse(clientErrors, validatedData);
  }

  private static isBlueprint(data: unknown): data is MyCurtainsParams {
    if (typeof data !== "object" || data === null) {
      return false;
    }
    const blueprint = data as MyCurtainsParams;
    return typeof blueprint.curtainId === "string";
  }
}
