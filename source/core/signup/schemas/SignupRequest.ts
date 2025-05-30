import type { ParserResponse } from "../../../@types/responses";
import type { ExpressRequest } from "../../../@types/wrappers";
import type { IRequest } from "../../../app/interfaces/IRequest";
import { ClientError, ClientErrorCode } from "../../../app/schemas/ClientError";
import { ProtoUtil } from "../../../app/utils/ProtoUtil";
import { ResponseUtil } from "../../../app/utils/ResponseUtil";
import { EAccountType } from "../../../common/enums/EAccountType";
import { DeviceNameValidator } from "../../../common/validators/DeviceNameValidator";
import { NameValidator } from "../../../common/validators/NameValidator";
import { PasswordValidator } from "../../../common/validators/PasswordValidator";
import { PhoneValidator } from "../../../common/validators/PhoneValidator";
import { SessionKeyValidator } from "../../../common/validators/SessionKeyValidator";
import { SurnameValidator } from "../../../common/validators/SurnameValidator";

export class SignupRequest implements IRequest {
  public constructor(
    public readonly phone: string,
    public readonly password: string,
    public readonly name: string,
    public readonly surname: string,
    public readonly accountType: EAccountType,
    public readonly deviceName: string,
    public readonly sessionKey: string,
  ) {}

  public static parse(req: ExpressRequest): ParserResponse<SignupRequest | null> {
    const preliminaryData: unknown = req.body;
    // >----------< EXISTENCE VALIDATION >----------<
    if (!ProtoUtil.isProtovalid(preliminaryData)) {
      return ResponseUtil.parserResponse([new ClientError(ClientErrorCode.MISSING_BODY)], null);
    }
    const protovalidData: unknown = preliminaryData;
    // >----------< SCHEMATIC VALIDATION >----------<
    if (!SignupRequest.isBlueprint(protovalidData)) {
      return ResponseUtil.parserResponse([new ClientError(ClientErrorCode.INVALID_BODY)], null);
    }
    const blueprintData: SignupRequest = protovalidData;
    // >----------< PHYSICAL VALIDATION >----------<
    const clientErrors: ClientError[] = [];
    PhoneValidator.validate(blueprintData.phone, clientErrors);
    PasswordValidator.validate(blueprintData.password, clientErrors);
    NameValidator.validate(blueprintData.name, clientErrors);
    SurnameValidator.validate(blueprintData.surname, clientErrors);
    DeviceNameValidator.validate(blueprintData.deviceName, clientErrors);
    SessionKeyValidator.validate(blueprintData.sessionKey, clientErrors);
    const validatedData = blueprintData;
    // >----------< RETURN >----------<
    return ResponseUtil.parserResponse(clientErrors, validatedData);
  }

  private static isBlueprint(obj: unknown): obj is SignupRequest {
    if (typeof obj !== "object" || obj === null) {
      return false;
    }
    const blueprint = obj as SignupRequest;
    return (
      typeof blueprint.phone === "string" &&
      typeof blueprint.password === "string" &&
      typeof blueprint.name === "string" &&
      typeof blueprint.surname === "string" &&
      Object.values(EAccountType).includes(blueprint.accountType) &&
      typeof blueprint.deviceName === "string" &&
      typeof blueprint.sessionKey === "string"
    );
  }
}
