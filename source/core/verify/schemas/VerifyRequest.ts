import type { ParserResponse } from "../../../@types/responses";
import type { ExpressRequest } from "../../../@types/wrappers";
import type { IRequest } from "../../../app/interfaces/IRequest";
import { ClientError, ClientErrorCode } from "../../../app/schemas/ClientError";
import { ProtoUtil } from "../../../app/utils/ProtoUtil";
import { ResponseUtil } from "../../../app/utils/ResponseUtil";
import { CodeValidator } from "../../../common/validators/CodeValidator";
import { DeviceNameValidator } from "../../../common/validators/DeviceNameValidator";
import { PhoneValidator } from "../../../common/validators/PhoneValidator";
import { SessionKeyValidator } from "../../../common/validators/SessionKeyValidator";

export class VerifyRequest implements IRequest {
  public constructor(
    public readonly phone: string,
    public readonly code: string,
    public readonly deviceName: string,
    public readonly sessionKey: string,
  ) {}

  public static parse(req: ExpressRequest): ParserResponse<VerifyRequest | null> {
    const preliminaryData: unknown = req.body;
    // V1: Existence validation
    if (!ProtoUtil.isProtovalid(preliminaryData)) {
      return ResponseUtil.parserResponse([new ClientError(ClientErrorCode.MISSING_BODY)], null);
    }
    const protovalidData: unknown = preliminaryData;
    // V2: Schematic validation
    if (!VerifyRequest.isBlueprint(protovalidData)) {
      return ResponseUtil.parserResponse([new ClientError(ClientErrorCode.INVALID_BODY)], null);
    }
    const blueprintData: VerifyRequest = protovalidData;
    // V3: Physical validation
    const clientErrors: ClientError[] = [];
    PhoneValidator.validate(blueprintData.phone, clientErrors);
    CodeValidator.validate(blueprintData.code, clientErrors);
    DeviceNameValidator.validate(blueprintData.deviceName, clientErrors);
    SessionKeyValidator.validate(blueprintData.sessionKey, clientErrors);
    const validatedData = blueprintData;
    // Return parser response
    return ResponseUtil.parserResponse(clientErrors, validatedData);
  }

  private static isBlueprint(obj: unknown): obj is VerifyRequest {
    if (typeof obj !== "object" || obj === null) {
      return false;
    }
    const blueprint = obj as VerifyRequest;
    return (
      typeof blueprint.phone === "string" &&
      typeof blueprint.code === "string" &&
      typeof blueprint.deviceName === "string" &&
      typeof blueprint.sessionKey === "string"
    );
  }
}
