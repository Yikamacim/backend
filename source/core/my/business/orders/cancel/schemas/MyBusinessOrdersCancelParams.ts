import type { ParserResponse } from "../../../../../../@types/responses";
import type { ExpressRequest } from "../../../../../../@types/wrappers";
import type { IParams } from "../../../../../../app/interfaces/IParams";
import { ClientError, ClientErrorCode } from "../../../../../../app/schemas/ClientError";
import { ProtoUtil } from "../../../../../../app/utils/ProtoUtil";
import { ResponseUtil } from "../../../../../../app/utils/ResponseUtil";
import { StringUtil } from "../../../../../../app/utils/StringUtil";

export class MyBusinessOrdersCancelParams implements IParams {
  private constructor(public readonly orderId: string) {}

  public static parse(req: ExpressRequest): ParserResponse<MyBusinessOrdersCancelParams | null> {
    const preliminaryData: unknown = req.params["orderId"];
    // >----------< EXISTENCE VALIDATION >----------<
    if (!ProtoUtil.isProtovalid(preliminaryData)) {
      return ResponseUtil.parserResponse(
        [new ClientError(ClientErrorCode.MISSING_PARAMETER)],
        null,
      );
    }
    const protovalidData: unknown = { orderId: preliminaryData };
    // >----------< SCHEMATIC VALIDATION >----------<
    if (!MyBusinessOrdersCancelParams.isBlueprint(protovalidData)) {
      return ResponseUtil.parserResponse(
        [new ClientError(ClientErrorCode.INVALID_PARAMETER)],
        null,
      );
    }
    const blueprintData: MyBusinessOrdersCancelParams = protovalidData;
    // >----------< PHYSICAL VALIDATION >----------<
    const clientErrors: ClientError[] = [];
    if (!StringUtil.isIntParsable(blueprintData.orderId)) {
      clientErrors.push(new ClientError(ClientErrorCode.INVALID_ORDER_ID));
    }
    const validatedData = blueprintData;
    // >----------< RETURN >----------<
    return ResponseUtil.parserResponse(clientErrors, validatedData);
  }

  private static isBlueprint(data: unknown): data is MyBusinessOrdersCancelParams {
    if (typeof data !== "object" || data === null) {
      return false;
    }
    const blueprint = data as MyBusinessOrdersCancelParams;
    return typeof blueprint.orderId === "string";
  }
}
