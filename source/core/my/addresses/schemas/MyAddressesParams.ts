import type { ParserResponse } from "../../../../@types/responses";
import type { ExpressRequest } from "../../../../@types/wrappers";
import type { IParams } from "../../../../app/interfaces/IParams";
import { ClientError, ClientErrorCode } from "../../../../app/schemas/ClientError";
import { ProtoUtil } from "../../../../app/utils/ProtoUtil";
import { ResponseUtil } from "../../../../app/utils/ResponseUtil";
import { StringUtil } from "../../../../app/utils/StringUtil";

export class MyAddressesParams implements IParams {
  private constructor(public readonly addressId: string) {}

  public static parse(req: ExpressRequest): ParserResponse<MyAddressesParams | null> {
    const preliminaryData: unknown = req.params["addressId"];
    // >----------< EXISTENCE VALIDATION >----------<
    if (!ProtoUtil.isProtovalid(preliminaryData)) {
      return ResponseUtil.parserResponse(
        [new ClientError(ClientErrorCode.MISSING_PARAMETER)],
        null,
      );
    }
    const protovalidData: unknown = { addressId: preliminaryData };
    // >----------< SCHEMATIC VALIDATION >----------<
    if (!MyAddressesParams.isBlueprint(protovalidData)) {
      return ResponseUtil.parserResponse(
        [new ClientError(ClientErrorCode.INVALID_PARAMETER)],
        null,
      );
    }
    const blueprintData: MyAddressesParams = protovalidData;
    // >----------< PHYSICAL VALIDATION >----------<
    const clientErrors: ClientError[] = [];
    if (!StringUtil.isIntParsable(blueprintData.addressId)) {
      clientErrors.push(new ClientError(ClientErrorCode.INVALID_ADDRESS_ID));
    }
    const validatedData = blueprintData;
    // >----------< RETURN >----------<
    return ResponseUtil.parserResponse(clientErrors, validatedData);
  }

  private static isBlueprint(data: unknown): data is MyAddressesParams {
    if (typeof data !== "object" || data === null) {
      return false;
    }
    const blueprint = data as MyAddressesParams;
    return typeof blueprint.addressId === "string";
  }
}
