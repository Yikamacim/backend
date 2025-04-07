import type { MediaData } from "../../../../@types/medias";
import type { IResponse } from "../../../../app/interfaces/IResponse";
import type { VehicleType } from "../../../../common/enums/VehicleType";
import type { VehicleViewModel } from "../../../../common/models/VehicleViewModel";

export class MyVehiclesResponse implements IResponse {
  private constructor(
    public readonly vehicleId: number,
    public readonly name: string,
    public readonly description: string,
    public readonly medias: MediaData[],
    public readonly brand: string | null,
    public readonly model: string | null,
    public readonly vehicleType: VehicleType | null,
  ) {}

  public static fromModel(model: VehicleViewModel, medias: MediaData[]): MyVehiclesResponse {
    return new MyVehiclesResponse(
      model.vehicleId,
      model.name,
      model.description,
      medias,
      model.brand,
      model.model,
      model.vehicleType,
    );
  }
}
