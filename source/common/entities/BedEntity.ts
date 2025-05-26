import type { IEntity } from "../../app/interfaces/IEntity";
import type { BedViewModel } from "../models/BedViewModel";
import type { MediaEntity } from "./MediaEntity";

export class BedEntity implements IEntity {
  public constructor(
    public readonly model: BedViewModel,
    public readonly medias: MediaEntity[],
  ) {}
}
