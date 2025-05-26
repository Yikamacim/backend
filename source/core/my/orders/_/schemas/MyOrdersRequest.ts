import type { ParserResponse } from "../../../../../@types/responses";
import type { ExpressRequest } from "../../../../../@types/wrappers";
import type { IRequest } from "../../../../../app/interfaces/IRequest";
import { ClientError, ClientErrorCode } from "../../../../../app/schemas/ClientError";
import { ProtoUtil } from "../../../../../app/utils/ProtoUtil";
import { ResponseUtil } from "../../../../../app/utils/ResponseUtil";
import { ItemIdsValidator } from "../../../../../common/validators/ItemIdsValidator";
import { OrderNoteValidator } from "../../../../../common/validators/OrderNoteValidator";

export class MyOrdersRequest implements IRequest {
  public constructor(
    public readonly serviceId: number,
    public readonly addressId: number,
    public readonly itemIds: number[],
    public readonly note: string | null,
  ) {}

  public static parse(req: ExpressRequest): ParserResponse<MyOrdersRequest | null> {
    const preliminaryData: unknown = req.body;
    // >----------< EXISTENCE VALIDATION >----------<
    if (!ProtoUtil.isProtovalid(preliminaryData)) {
      return ResponseUtil.parserResponse([new ClientError(ClientErrorCode.MISSING_BODY)], null);
    }
    const protovalidData: unknown = preliminaryData;
    // >----------< SCHEMATIC VALIDATION >----------<
    if (!MyOrdersRequest.isBlueprint(protovalidData)) {
      return ResponseUtil.parserResponse([new ClientError(ClientErrorCode.INVALID_BODY)], null);
    }
    const blueprintData: MyOrdersRequest = protovalidData;
    // >----------< PHYSICAL VALIDATION >----------<
    const clientErrors: ClientError[] = [];
    ItemIdsValidator.validate(blueprintData.itemIds, clientErrors);
    if (blueprintData.note !== null) {
      OrderNoteValidator.validate(blueprintData.note, clientErrors);
    }
    const validatedData = blueprintData;
    // >----------< RETURN >----------<
    return ResponseUtil.parserResponse(clientErrors, validatedData);
  }

  private static isBlueprint(obj: unknown): obj is MyOrdersRequest {
    if (typeof obj !== "object" || obj === null) {
      return false;
    }
    const blueprint = obj as MyOrdersRequest;
    return (
      typeof blueprint.serviceId === "number" &&
      typeof blueprint.addressId === "number" &&
      Array.isArray(blueprint.itemIds) &&
      blueprint.itemIds.every((itemId) => typeof itemId === "number") &&
      (blueprint.note === null || typeof blueprint.note === "string")
    );
  }
}
