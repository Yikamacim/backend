import type { ParserResponse } from "../../../../../@types/responses";
import type { ExpressRequest } from "../../../../../@types/wrappers";
import type { IRequest } from "../../../../../app/interfaces/IRequest";
import { ClientError, ClientErrorCode } from "../../../../../app/schemas/ClientError";
import { ProtoUtil } from "../../../../../app/utils/ProtoUtil";
import { ResponseUtil } from "../../../../../app/utils/ResponseUtil";
import { OrderMessageValidator } from "../../../../../common/validators/OrderMessageValidator";

export class MyOrdersMessagesRequest implements IRequest {
  public constructor(public readonly content: string) {}

  public static parse(req: ExpressRequest): ParserResponse<MyOrdersMessagesRequest | null> {
    const preliminaryData: unknown = req.body;
    // >----------< EXISTENCE VALIDATION >----------<
    if (!ProtoUtil.isProtovalid(preliminaryData)) {
      return ResponseUtil.parserResponse([new ClientError(ClientErrorCode.MISSING_BODY)], null);
    }
    const protovalidData: unknown = preliminaryData;
    // >----------< SCHEMATIC VALIDATION >----------<
    if (!MyOrdersMessagesRequest.isBlueprint(protovalidData)) {
      return ResponseUtil.parserResponse([new ClientError(ClientErrorCode.INVALID_BODY)], null);
    }
    const blueprintData: MyOrdersMessagesRequest = protovalidData;
    // >----------< PHYSICAL VALIDATION >----------<
    const clientErrors: ClientError[] = [];
    OrderMessageValidator.validate(blueprintData.content, clientErrors);
    const validatedData = blueprintData;
    // >----------< RETURN >----------<
    return ResponseUtil.parserResponse(clientErrors, validatedData);
  }

  private static isBlueprint(obj: unknown): obj is MyOrdersMessagesRequest {
    if (typeof obj !== "object" || obj === null) {
      return false;
    }
    const blueprint = obj as MyOrdersMessagesRequest;
    return typeof blueprint.content === "string";
  }
}
