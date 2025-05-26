import type { IEntity } from "../../app/interfaces/IEntity";
import type { NeighborhoodModel } from "../models/NeighborhoodModel";

export class NeighborhoodEntity implements IEntity {
  public constructor(public readonly model: NeighborhoodModel) {}
}
