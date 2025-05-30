import type { ParserResponse } from "../../../../../@types/responses";
import type { ExpressRequest } from "../../../../../@types/wrappers";
import type { IParams } from "../../../../../app/interfaces/IParams";
import { ClientError, ClientErrorCode } from "../../../../../app/schemas/ClientError";
import { ProtoUtil } from "../../../../../app/utils/ProtoUtil";
import { ResponseUtil } from "../../../../../app/utils/ResponseUtil";
import { StringUtil } from "../../../../../app/utils/StringUtil";

export class MyBusinessServicesParams implements IParams {
  private constructor(public readonly serviceId: string) {}

  public static parse(req: ExpressRequest): ParserResponse<MyBusinessServicesParams | null> {
    const preliminaryData: unknown = req.params["serviceId"];
    // >----------< EXISTENCE VALIDATION >----------<
    if (!ProtoUtil.isProtovalid(preliminaryData)) {
      return ResponseUtil.parserResponse(
        [new ClientError(ClientErrorCode.MISSING_PARAMETER)],
        null,
      );
    }
    const protovalidData: unknown = { serviceId: preliminaryData };
    // >----------< SCHEMATIC VALIDATION >----------<
    if (!MyBusinessServicesParams.isBlueprint(protovalidData)) {
      return ResponseUtil.parserResponse(
        [new ClientError(ClientErrorCode.INVALID_PARAMETER)],
        null,
      );
    }
    const blueprintData: MyBusinessServicesParams = protovalidData;
    // >----------< PHYSICAL VALIDATION >----------<
    const clientErrors: ClientError[] = [];
    if (!StringUtil.isIntParsable(blueprintData.serviceId)) {
      clientErrors.push(new ClientError(ClientErrorCode.INVALID_SERVICE_ID));
    }
    const validatedData = blueprintData;
    // >----------< RETURN >----------<
    return ResponseUtil.parserResponse(clientErrors, validatedData);
  }

  private static isBlueprint(data: unknown): data is MyBusinessServicesParams {
    if (typeof data !== "object" || data === null) {
      return false;
    }
    const blueprint = data as MyBusinessServicesParams;
    return typeof blueprint.serviceId === "string";
  }
}
