import type { ParserResponse } from "../../../@types/responses";
import type { ExpressRequest } from "../../../@types/wrappers";
import type { IParams } from "../../../app/interfaces/IParams";
import { ClientError, ClientErrorCode } from "../../../app/schemas/ClientError";
import { ProtoUtil } from "../../../app/utils/ProtoUtil";
import { ResponseUtil } from "../../../app/utils/ResponseUtil";
import { PhoneValidator } from "../../../common/validators/PhoneValidator";

export class VerifyParams implements IParams {
  private constructor(public readonly phone: string) {}

  public static parse(req: ExpressRequest): ParserResponse<VerifyParams | null> {
    const preliminaryData: unknown = req.params["phone"];
    // >----------< EXISTENCE VALIDATION >----------<
    if (!ProtoUtil.isProtovalid(preliminaryData)) {
      return ResponseUtil.parserResponse(
        [new ClientError(ClientErrorCode.MISSING_PARAMETER)],
        null,
      );
    }
    const protovalidData: unknown = { phone: preliminaryData };
    // >----------< SCHEMATIC VALIDATION >----------<
    if (!VerifyParams.isBlueprint(protovalidData)) {
      return ResponseUtil.parserResponse(
        [new ClientError(ClientErrorCode.INVALID_PARAMETER)],
        null,
      );
    }
    const blueprintData: VerifyParams = protovalidData;
    // >----------< PHYSICAL VALIDATION >----------<
    const clientErrors: ClientError[] = [];
    PhoneValidator.validate(blueprintData.phone, clientErrors);
    const validatedData = blueprintData;
    // >----------< RETURN >----------<
    return ResponseUtil.parserResponse(clientErrors, validatedData);
  }

  private static isBlueprint(data: unknown): data is VerifyParams {
    if (typeof data !== "object" || data === null) {
      return false;
    }
    const blueprint = data as VerifyParams;
    return typeof blueprint.phone === "string";
  }
}
