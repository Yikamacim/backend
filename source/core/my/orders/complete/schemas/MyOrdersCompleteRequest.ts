import type { ParserResponse } from "../../../../../@types/responses";
import type { ExpressRequest } from "../../../../../@types/wrappers";
import type { IRequest } from "../../../../../app/interfaces/IRequest";
import { ClientError, ClientErrorCode } from "../../../../../app/schemas/ClientError";
import { ProtoUtil } from "../../../../../app/utils/ProtoUtil";
import { ResponseUtil } from "../../../../../app/utils/ResponseUtil";

export class MyOrdersCompleteRequest implements IRequest {
  public constructor(public readonly cardId: number) {}

  public static parse(req: ExpressRequest): ParserResponse<MyOrdersCompleteRequest | null> {
    const preliminaryData: unknown = req.body;
    // >----------< EXISTENCE VALIDATION >----------<
    if (!ProtoUtil.isProtovalid(preliminaryData)) {
      return ResponseUtil.parserResponse([new ClientError(ClientErrorCode.MISSING_BODY)], null);
    }
    const protovalidData: unknown = preliminaryData;
    // >----------< SCHEMATIC VALIDATION >----------<
    if (!MyOrdersCompleteRequest.isBlueprint(protovalidData)) {
      return ResponseUtil.parserResponse([new ClientError(ClientErrorCode.INVALID_BODY)], null);
    }
    const blueprintData: MyOrdersCompleteRequest = protovalidData;
    // >----------< PHYSICAL VALIDATION >----------<
    const clientErrors: ClientError[] = [];
    const validatedData = blueprintData;
    // >----------< RETURN >----------<
    return ResponseUtil.parserResponse(clientErrors, validatedData);
  }

  private static isBlueprint(obj: unknown): obj is MyOrdersCompleteRequest {
    if (typeof obj !== "object" || obj === null) {
      return false;
    }
    const blueprint = obj as MyOrdersCompleteRequest;
    return typeof blueprint.cardId === "number";
  }
}
