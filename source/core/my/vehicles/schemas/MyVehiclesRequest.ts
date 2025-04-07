import type { ParserResponse } from "../../../../@types/responses";
import type { ExpressRequest } from "../../../../@types/wrappers";
import type { IRequest } from "../../../../app/interfaces/IRequest";
import { ClientError, ClientErrorCode } from "../../../../app/schemas/ClientError";
import { ProtoUtil } from "../../../../app/utils/ProtoUtil";
import { ResponseUtil } from "../../../../app/utils/ResponseUtil";
import { VehicleType } from "../../../../common/enums/VehicleType";
import { ItemDescriptionValidator } from "../../../../common/validators/ItemDescriptionValidator";
import { ItemNameValidator } from "../../../../common/validators/ItemNameValidator";
import { MediaIdsValidator } from "../../../../common/validators/MediaIdsValidator";
import { VehicleBrandValidator } from "../../../../common/validators/VehicleBrandValidator";
import { VehicleModelValidator } from "../../../../common/validators/VehicleModelValidator";

export class MyVehiclesRequest implements IRequest {
  public constructor(
    public readonly name: string,
    public readonly description: string,
    public readonly mediaIds: number[],
    public readonly brand: string | null,
    public readonly model: string | null,
    public readonly vehicleType: VehicleType | null,
  ) {}

  public static parse(req: ExpressRequest): ParserResponse<MyVehiclesRequest | null> {
    const preliminaryData: unknown = req.body;
    // >----------< EXISTENCE VALIDATION >----------<
    if (!ProtoUtil.isProtovalid(preliminaryData)) {
      return ResponseUtil.parserResponse([new ClientError(ClientErrorCode.MISSING_BODY)], null);
    }
    const protovalidData: unknown = preliminaryData;
    // >----------< SCHEMATIC VALIDATION >----------<
    if (!MyVehiclesRequest.isBlueprint(protovalidData)) {
      return ResponseUtil.parserResponse([new ClientError(ClientErrorCode.INVALID_BODY)], null);
    }
    const blueprintData: MyVehiclesRequest = protovalidData;
    // >----------< PHYSICAL VALIDATION >----------<
    const clientErrors: ClientError[] = [];
    ItemNameValidator.validate(blueprintData.name, clientErrors);
    ItemDescriptionValidator.validate(blueprintData.description, clientErrors);
    MediaIdsValidator.validate(blueprintData.mediaIds, clientErrors);
    if (blueprintData.brand !== null) {
      VehicleBrandValidator.validate(blueprintData.brand, clientErrors);
    }
    if (blueprintData.model !== null) {
      VehicleModelValidator.validate(blueprintData.model, clientErrors);
    }
    const validatedData = blueprintData;
    // >----------< RETURN >----------<
    return ResponseUtil.parserResponse(clientErrors, validatedData);
  }

  private static isBlueprint(obj: unknown): obj is MyVehiclesRequest {
    if (typeof obj !== "object" || obj === null) {
      return false;
    }
    const blueprint = obj as MyVehiclesRequest;
    return (
      typeof blueprint.name === "string" &&
      typeof blueprint.description === "string" &&
      Array.isArray(blueprint.mediaIds) &&
      blueprint.mediaIds.every((mediaId: unknown): boolean => typeof mediaId === "number") &&
      (blueprint.brand === null || typeof blueprint.brand === "string") &&
      (blueprint.model === null || typeof blueprint.model === "string") &&
      (blueprint.vehicleType === null || Object.values(VehicleType).includes(blueprint.vehicleType))
    );
  }
}
