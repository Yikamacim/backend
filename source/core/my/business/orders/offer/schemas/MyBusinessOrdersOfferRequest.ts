import type { ParserResponse } from "../../../../../../@types/responses";
import type { ExpressRequest } from "../../../../../../@types/wrappers";
import type { IRequest } from "../../../../../../app/interfaces/IRequest";
import { ClientError, ClientErrorCode } from "../../../../../../app/schemas/ClientError";
import { ProtoUtil } from "../../../../../../app/utils/ProtoUtil";
import { ResponseUtil } from "../../../../../../app/utils/ResponseUtil";
import { OrderPriceValidator } from "../../../../../../common/validators/OrderPriceValidator";

export class MyBusinessOrdersOfferRequest implements IRequest {
  public constructor(public readonly price: number) {}

  public static parse(req: ExpressRequest): ParserResponse<MyBusinessOrdersOfferRequest | null> {
    const preliminaryData: unknown = req.body;
    // >----------< EXISTENCE VALIDATION >----------<
    if (!ProtoUtil.isProtovalid(preliminaryData)) {
      return ResponseUtil.parserResponse([new ClientError(ClientErrorCode.MISSING_BODY)], null);
    }
    const protovalidData: unknown = preliminaryData;
    // >----------< SCHEMATIC VALIDATION >----------<
    if (!MyBusinessOrdersOfferRequest.isBlueprint(protovalidData)) {
      return ResponseUtil.parserResponse([new ClientError(ClientErrorCode.INVALID_BODY)], null);
    }
    const blueprintData: MyBusinessOrdersOfferRequest = protovalidData;
    // >----------< PHYSICAL VALIDATION >----------<
    const clientErrors: ClientError[] = [];
    OrderPriceValidator.validate(blueprintData.price, clientErrors);
    const validatedData = blueprintData;
    // >----------< RETURN >----------<
    return ResponseUtil.parserResponse(clientErrors, validatedData);
  }

  private static isBlueprint(obj: unknown): obj is MyBusinessOrdersOfferRequest {
    if (typeof obj !== "object" || obj === null) {
      return false;
    }
    const blueprint = obj as MyBusinessOrdersOfferRequest;
    return typeof blueprint.price === "number";
  }
}
