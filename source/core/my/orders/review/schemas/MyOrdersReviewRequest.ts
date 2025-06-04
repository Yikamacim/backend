import type { ParserResponse } from "../../../../../@types/responses";
import type { ExpressRequest } from "../../../../../@types/wrappers";
import type { IRequest } from "../../../../../app/interfaces/IRequest";
import { ClientError, ClientErrorCode } from "../../../../../app/schemas/ClientError";
import { ProtoUtil } from "../../../../../app/utils/ProtoUtil";
import { ResponseUtil } from "../../../../../app/utils/ResponseUtil";
import { ReviewCommentValidator } from "../../../../../common/validators/ReviewCommentValidator";
import { ReviewStarsValidator } from "../../../../../common/validators/ReviewStarsValidator";

export class MyOrdersReviewRequest implements IRequest {
  public constructor(
    public readonly stars: number,
    public readonly comment: string,
  ) {}

  public static parse(req: ExpressRequest): ParserResponse<MyOrdersReviewRequest | null> {
    const preliminaryData: unknown = req.body;
    // >----------< EXISTENCE VALIDATION >----------<
    if (!ProtoUtil.isProtovalid(preliminaryData)) {
      return ResponseUtil.parserResponse([new ClientError(ClientErrorCode.MISSING_BODY)], null);
    }
    const protovalidData: unknown = preliminaryData;
    // >----------< SCHEMATIC VALIDATION >----------<
    if (!MyOrdersReviewRequest.isBlueprint(protovalidData)) {
      return ResponseUtil.parserResponse([new ClientError(ClientErrorCode.INVALID_BODY)], null);
    }
    const blueprintData: MyOrdersReviewRequest = protovalidData;
    // >----------< PHYSICAL VALIDATION >----------<
    const clientErrors: ClientError[] = [];
    ReviewStarsValidator.validate(blueprintData.stars, clientErrors);
    ReviewCommentValidator.validate(blueprintData.comment, clientErrors);
    const validatedData = blueprintData;
    // >----------< RETURN >----------<
    return ResponseUtil.parserResponse(clientErrors, validatedData);
  }

  private static isBlueprint(obj: unknown): obj is MyOrdersReviewRequest {
    if (typeof obj !== "object" || obj === null) {
      return false;
    }
    const blueprint = obj as MyOrdersReviewRequest;
    return typeof blueprint.stars === "number" && typeof blueprint.comment === "string";
  }
}
