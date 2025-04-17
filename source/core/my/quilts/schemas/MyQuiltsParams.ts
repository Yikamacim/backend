import type { ParserResponse } from "../../../../@types/responses";
import type { ExpressRequest } from "../../../../@types/wrappers";
import type { IParams } from "../../../../app/interfaces/IParams";
import { ClientError, ClientErrorCode } from "../../../../app/schemas/ClientError";
import { ProtoUtil } from "../../../../app/utils/ProtoUtil";
import { ResponseUtil } from "../../../../app/utils/ResponseUtil";
import { StringUtil } from "../../../../app/utils/StringUtil";

export class MyQuiltsParams implements IParams {
  private constructor(public readonly quiltId: string) {}

  public static parse(req: ExpressRequest): ParserResponse<MyQuiltsParams | null> {
    const preliminaryData: unknown = req.params["quiltId"];
    // >----------< EXISTENCE VALIDATION >----------<
    if (!ProtoUtil.isProtovalid(preliminaryData)) {
      return ResponseUtil.parserResponse(
        [new ClientError(ClientErrorCode.MISSING_PARAMETER)],
        null,
      );
    }
    const protovalidData: unknown = { quiltId: preliminaryData };
    // >----------< SCHEMATIC VALIDATION >----------<
    if (!MyQuiltsParams.isBlueprint(protovalidData)) {
      return ResponseUtil.parserResponse(
        [new ClientError(ClientErrorCode.INVALID_PARAMETER)],
        null,
      );
    }
    const blueprintData: MyQuiltsParams = protovalidData;
    // >----------< PHYSICAL VALIDATION >----------<
    const clientErrors: ClientError[] = [];
    if (!StringUtil.isIntParsable(blueprintData.quiltId)) {
      clientErrors.push(new ClientError(ClientErrorCode.INVALID_QUILT_ID));
    }
    const validatedData = blueprintData;
    // >----------< RETURN >----------<
    return ResponseUtil.parserResponse(clientErrors, validatedData);
  }

  private static isBlueprint(data: unknown): data is MyQuiltsParams {
    if (typeof data !== "object" || data === null) {
      return false;
    }
    const blueprint = data as MyQuiltsParams;
    return typeof blueprint.quiltId === "string";
  }
}
