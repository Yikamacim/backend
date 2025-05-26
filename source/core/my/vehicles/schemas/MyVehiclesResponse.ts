import type { IResponse } from "../../../../app/interfaces/IResponse";
import type { VehicleEntity } from "../../../../common/entities/VehicleEntity";
import type { EMediaType } from "../../../../common/enums/EMediaType";
import type { EVehicleType } from "../../../../common/enums/EVehicleType";

export class MyVehiclesResponse implements IResponse {
  private constructor(
    public readonly vehicleId: number,
    public readonly name: string,
    public readonly description: string,
    public readonly medias: {
      readonly mediaId: number;
      readonly mediaType: EMediaType;
      readonly extension: string;
      readonly url: string;
    }[],
    public readonly brand: string | null,
    public readonly model: string | null,
    public readonly vehicleType: EVehicleType | null,
  ) {}

  public static fromEntity(entity: VehicleEntity): MyVehiclesResponse {
    return new MyVehiclesResponse(
      entity.model.vehicleId,
      entity.model.name,
      entity.model.description,
      entity.medias,
      entity.model.brand,
      entity.model.model,
      entity.model.vehicleType,
    );
  }

  public static fromEntities(entities: VehicleEntity[]): MyVehiclesResponse[] {
    return entities.map((entity) => MyVehiclesResponse.fromEntity(entity));
  }
}
