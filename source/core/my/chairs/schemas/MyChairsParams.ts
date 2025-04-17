import type { ParserResponse } from "../../../../@types/responses";
import type { ExpressRequest } from "../../../../@types/wrappers";
import type { IParams } from "../../../../app/interfaces/IParams";
import { ClientError, ClientErrorCode } from "../../../../app/schemas/ClientError";
import { ProtoUtil } from "../../../../app/utils/ProtoUtil";
import { ResponseUtil } from "../../../../app/utils/ResponseUtil";
import { StringUtil } from "../../../../app/utils/StringUtil";

export class MyChairsParams implements IParams {
  private constructor(public readonly chairId: string) {}

  public static parse(req: ExpressRequest): ParserResponse<MyChairsParams | null> {
    const preliminaryData: unknown = req.params["chairId"];
    // >----------< EXISTENCE VALIDATION >----------<
    if (!ProtoUtil.isProtovalid(preliminaryData)) {
      return ResponseUtil.parserResponse(
        [new ClientError(ClientErrorCode.MISSING_PARAMETER)],
        null,
      );
    }
    const protovalidData: unknown = { chairId: preliminaryData };
    // >----------< SCHEMATIC VALIDATION >----------<
    if (!MyChairsParams.isBlueprint(protovalidData)) {
      return ResponseUtil.parserResponse(
        [new ClientError(ClientErrorCode.INVALID_PARAMETER)],
        null,
      );
    }
    const blueprintData: MyChairsParams = protovalidData;
    // >----------< PHYSICAL VALIDATION >----------<
    const clientErrors: ClientError[] = [];
    if (!StringUtil.isIntParsable(blueprintData.chairId)) {
      clientErrors.push(new ClientError(ClientErrorCode.INVALID_CHAIR_ID));
    }
    const validatedData = blueprintData;
    // >----------< RETURN >----------<
    return ResponseUtil.parserResponse(clientErrors, validatedData);
  }

  private static isBlueprint(data: unknown): data is MyChairsParams {
    if (typeof data !== "object" || data === null) {
      return false;
    }
    const blueprint = data as MyChairsParams;
    return typeof blueprint.chairId === "string";
  }
}
