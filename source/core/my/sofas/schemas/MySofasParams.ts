import type { ParserResponse } from "../../../../@types/responses";
import type { ExpressRequest } from "../../../../@types/wrappers";
import type { IParams } from "../../../../app/interfaces/IParams";
import { ClientError, ClientErrorCode } from "../../../../app/schemas/ClientError";
import { ProtoUtil } from "../../../../app/utils/ProtoUtil";
import { ResponseUtil } from "../../../../app/utils/ResponseUtil";
import { StringUtil } from "../../../../app/utils/StringUtil";

export class MySofasParams implements IParams {
  private constructor(public readonly sofaId: string) {}

  public static parse(req: ExpressRequest): ParserResponse<MySofasParams | null> {
    const preliminaryData: unknown = req.params["sofaId"];
    // >----------< EXISTENCE VALIDATION >----------<
    if (!ProtoUtil.isProtovalid(preliminaryData)) {
      return ResponseUtil.parserResponse(
        [new ClientError(ClientErrorCode.MISSING_PARAMETER)],
        null,
      );
    }
    const protovalidData: unknown = { sofaId: preliminaryData };
    // >----------< SCHEMATIC VALIDATION >----------<
    if (!MySofasParams.isBlueprint(protovalidData)) {
      return ResponseUtil.parserResponse(
        [new ClientError(ClientErrorCode.INVALID_PARAMETER)],
        null,
      );
    }
    const blueprintData: MySofasParams = protovalidData;
    // >----------< PHYSICAL VALIDATION >----------<
    const clientErrors: ClientError[] = [];
    if (!StringUtil.isIntParsable(blueprintData.sofaId)) {
      clientErrors.push(new ClientError(ClientErrorCode.INVALID_SOFA_ID));
    }
    const validatedData = blueprintData;
    // >----------< RETURN >----------<
    return ResponseUtil.parserResponse(clientErrors, validatedData);
  }

  private static isBlueprint(data: unknown): data is MySofasParams {
    if (typeof data !== "object" || data === null) {
      return false;
    }
    const blueprint = data as MySofasParams;
    return typeof blueprint.sofaId === "string";
  }
}
