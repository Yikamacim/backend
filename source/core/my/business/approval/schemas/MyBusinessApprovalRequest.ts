import type { ParserResponse } from "../../../../../@types/responses";
import type { ExpressRequest } from "../../../../../@types/wrappers";
import type { IRequest } from "../../../../../app/interfaces/IRequest";
import { ClientError, ClientErrorCode } from "../../../../../app/schemas/ClientError";
import { ProtoUtil } from "../../../../../app/utils/ProtoUtil";
import { ResponseUtil } from "../../../../../app/utils/ResponseUtil";
import { ApprovalMessageValidator } from "../../../../../common/validators/ApprovalMessageValidator";
import { MediaIdsValidator } from "../../../../../common/validators/MediaIdsValidator";

export class MyBusinessApprovalRequest implements IRequest {
  public constructor(
    public readonly mediaIds: number[],
    public readonly message: string | null,
  ) {}

  public static parse(req: ExpressRequest): ParserResponse<MyBusinessApprovalRequest | null> {
    const preliminaryData: unknown = req.body;
    // >----------< EXISTENCE VALIDATION >----------<
    if (!ProtoUtil.isProtovalid(preliminaryData)) {
      return ResponseUtil.parserResponse([new ClientError(ClientErrorCode.MISSING_BODY)], null);
    }
    const protovalidData: unknown = preliminaryData;
    // >----------< SCHEMATIC VALIDATION >----------<
    if (!MyBusinessApprovalRequest.isBlueprint(protovalidData)) {
      return ResponseUtil.parserResponse([new ClientError(ClientErrorCode.INVALID_BODY)], null);
    }
    const blueprintData: MyBusinessApprovalRequest = protovalidData;
    // >----------< PHYSICAL VALIDATION >----------<
    const clientErrors: ClientError[] = [];
    MediaIdsValidator.validate(blueprintData.mediaIds, clientErrors);
    if (blueprintData.message !== null) {
      ApprovalMessageValidator.validate(blueprintData.message, clientErrors);
    }
    const validatedData = blueprintData;
    // >----------< RETURN >----------<
    return ResponseUtil.parserResponse(clientErrors, validatedData);
  }

  private static isBlueprint(obj: unknown): obj is MyBusinessApprovalRequest {
    if (typeof obj !== "object" || obj === null) {
      return false;
    }
    const blueprint = obj as MyBusinessApprovalRequest;
    return (
      Array.isArray(blueprint.mediaIds) &&
      blueprint.mediaIds.every((mediaId) => typeof mediaId === "number") &&
      (blueprint.message === null || typeof blueprint.message === "string")
    );
  }
}
