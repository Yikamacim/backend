import type { IEntity } from "../../app/interfaces/IEntity";
import type { VehicleViewModel } from "../models/VehicleViewModel";
import type { MediaEntity } from "./MediaEntity";

export class VehicleEntity implements IEntity {
  public constructor(
    public readonly model: VehicleViewModel,
    public readonly medias: MediaEntity[],
  ) {}
}
