import type { ParserResponse } from "../../../../@types/responses";
import type { ExpressRequest } from "../../../../@types/wrappers";
import type { IRequest } from "../../../../app/interfaces/IRequest";
import { ClientError, ClientErrorCode } from "../../../../app/schemas/ClientError";
import { ProtoUtil } from "../../../../app/utils/ProtoUtil";
import { ResponseUtil } from "../../../../app/utils/ResponseUtil";
import { ApprovalReasonValidator } from "../../../../common/validators/ApprovalReasonValidator";

export class MyAdminApprovalsRequest implements IRequest {
  public constructor(
    public readonly isApproved: boolean,
    public readonly reason: string | null,
  ) {}

  public static parse(req: ExpressRequest): ParserResponse<MyAdminApprovalsRequest | null> {
    const preliminaryData: unknown = req.body;
    // >----------< EXISTENCE VALIDATION >----------<
    if (!ProtoUtil.isProtovalid(preliminaryData)) {
      return ResponseUtil.parserResponse([new ClientError(ClientErrorCode.MISSING_BODY)], null);
    }
    const protovalidData: unknown = preliminaryData;
    // >----------< SCHEMATIC VALIDATION >----------<
    if (!MyAdminApprovalsRequest.isBlueprint(protovalidData)) {
      return ResponseUtil.parserResponse([new ClientError(ClientErrorCode.INVALID_BODY)], null);
    }
    const blueprintData: MyAdminApprovalsRequest = protovalidData;
    // >----------< PHYSICAL VALIDATION >----------<
    const clientErrors: ClientError[] = [];
    if (blueprintData.reason !== null) {
      ApprovalReasonValidator.validate(blueprintData.reason, clientErrors);
    }
    const validatedData = blueprintData;
    // >----------< RETURN >----------<
    return ResponseUtil.parserResponse(clientErrors, validatedData);
  }

  private static isBlueprint(obj: unknown): obj is MyAdminApprovalsRequest {
    if (typeof obj !== "object" || obj === null) {
      return false;
    }
    const blueprint = obj as MyAdminApprovalsRequest;
    return (
      typeof blueprint.isApproved === "boolean" &&
      (blueprint.reason === null || typeof blueprint.reason === "string")
    );
  }
}
