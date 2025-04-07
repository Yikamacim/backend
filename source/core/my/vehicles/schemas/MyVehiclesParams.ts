import type { ParserResponse } from "../../../../@types/responses";
import type { ExpressRequest } from "../../../../@types/wrappers";
import type { IParams } from "../../../../app/interfaces/IParams";
import { ClientError, ClientErrorCode } from "../../../../app/schemas/ClientError";
import { ProtoUtil } from "../../../../app/utils/ProtoUtil";
import { ResponseUtil } from "../../../../app/utils/ResponseUtil";
import { StringUtil } from "../../../../app/utils/StringUtil";

export class MyVehiclesParams implements IParams {
  private constructor(public readonly vehicleId: string) {}

  public static parse(req: ExpressRequest): ParserResponse<MyVehiclesParams | null> {
    const preliminaryData: unknown = req.params["vehicleId"];
    // >----------< EXISTENCE VALIDATION >----------<
    if (!ProtoUtil.isProtovalid(preliminaryData)) {
      return ResponseUtil.parserResponse(
        [new ClientError(ClientErrorCode.MISSING_PARAMETER)],
        null,
      );
    }
    const protovalidData: unknown = { vehicleId: preliminaryData };
    // >----------< SCHEMATIC VALIDATION >----------<
    if (!MyVehiclesParams.isBlueprint(protovalidData)) {
      return ResponseUtil.parserResponse(
        [new ClientError(ClientErrorCode.INVALID_PARAMETER)],
        null,
      );
    }
    const blueprintData: MyVehiclesParams = protovalidData;
    // >----------< PHYSICAL VALIDATION >----------<
    const clientErrors: ClientError[] = [];
    if (!StringUtil.isIntParsable(blueprintData.vehicleId)) {
      clientErrors.push(new ClientError(ClientErrorCode.INVALID_VEHICLE_ID));
    }
    const validatedData = blueprintData;
    // >----------< RETURN >----------<
    return ResponseUtil.parserResponse(clientErrors, validatedData);
  }

  private static isBlueprint(data: unknown): data is MyVehiclesParams {
    if (typeof data !== "object" || data === null) {
      return false;
    }
    const blueprint = data as MyVehiclesParams;
    return typeof blueprint.vehicleId === "string";
  }
}
