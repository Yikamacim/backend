import type { ParserResponse } from "../../../@types/responses";
import type { ExpressRequest } from "../../../@types/wrappers";
import type { IParams } from "../../../app/interfaces/IParams";
import { ClientError, ClientErrorCode } from "../../../app/schemas/ClientError";
import { ProtoUtil } from "../../../app/utils/ProtoUtil";
import { ResponseUtil } from "../../../app/utils/ResponseUtil";
import { PhoneValidator } from "../../../common/validators/PhoneValidator";

export class AccountsParams implements IParams {
  private constructor(public readonly phone: string) {}

  public static parse(req: ExpressRequest): ParserResponse<AccountsParams | null> {
    const preliminaryData = req.params["phone"];
    // V1: Existence validation
    if (!ProtoUtil.isProtovalid(preliminaryData)) {
      return ResponseUtil.parserResponse(
        [new ClientError(ClientErrorCode.MISSING_PARAMETER)],
        null,
      );
    }
    const protovalidData: unknown = { phone: preliminaryData };
    // V2: Schematic validation
    if (!AccountsParams.isBlueprint(protovalidData)) {
      return ResponseUtil.parserResponse(
        [new ClientError(ClientErrorCode.INVALID_PARAMETER)],
        null,
      );
    }
    const blueprintData: AccountsParams = protovalidData;
    // V3: Physical validation
    const clientErrors: ClientError[] = [];
    PhoneValidator.validate(blueprintData.phone, clientErrors);
    if (clientErrors.length > 0) {
      return ResponseUtil.parserResponse(clientErrors, null);
    }
    const validatedData = blueprintData;
    // Return parser response
    return ResponseUtil.parserResponse(clientErrors, validatedData);
  }

  private static isBlueprint(data: unknown): data is AccountsParams {
    if (typeof data !== "object" || data === null) {
      return false;
    }
    const blueprint = data as AccountsParams;
    return typeof blueprint.phone === "string";
  }
}
