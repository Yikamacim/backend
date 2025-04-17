import type { ParserResponse } from "../../../../@types/responses";
import type { ExpressRequest } from "../../../../@types/wrappers";
import type { IParams } from "../../../../app/interfaces/IParams";
import { ClientError, ClientErrorCode } from "../../../../app/schemas/ClientError";
import { ProtoUtil } from "../../../../app/utils/ProtoUtil";
import { ResponseUtil } from "../../../../app/utils/ResponseUtil";
import { StringUtil } from "../../../../app/utils/StringUtil";

export class MyBlanketsParams implements IParams {
  private constructor(public readonly blanketId: string) {}

  public static parse(req: ExpressRequest): ParserResponse<MyBlanketsParams | null> {
    const preliminaryData: unknown = req.params["blanketId"];
    // >----------< EXISTENCE VALIDATION >----------<
    if (!ProtoUtil.isProtovalid(preliminaryData)) {
      return ResponseUtil.parserResponse(
        [new ClientError(ClientErrorCode.MISSING_PARAMETER)],
        null,
      );
    }
    const protovalidData: unknown = { blanketId: preliminaryData };
    // >----------< SCHEMATIC VALIDATION >----------<
    if (!MyBlanketsParams.isBlueprint(protovalidData)) {
      return ResponseUtil.parserResponse(
        [new ClientError(ClientErrorCode.INVALID_PARAMETER)],
        null,
      );
    }
    const blueprintData: MyBlanketsParams = protovalidData;
    // >----------< PHYSICAL VALIDATION >----------<
    const clientErrors: ClientError[] = [];
    if (!StringUtil.isIntParsable(blueprintData.blanketId)) {
      clientErrors.push(new ClientError(ClientErrorCode.INVALID_BLANKET_ID));
    }
    const validatedData = blueprintData;
    // >----------< RETURN >----------<
    return ResponseUtil.parserResponse(clientErrors, validatedData);
  }

  private static isBlueprint(data: unknown): data is MyBlanketsParams {
    if (typeof data !== "object" || data === null) {
      return false;
    }
    const blueprint = data as MyBlanketsParams;
    return typeof blueprint.blanketId === "string";
  }
}
