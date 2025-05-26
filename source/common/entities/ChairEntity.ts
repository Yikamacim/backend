import type { IEntity } from "../../app/interfaces/IEntity";
import type { ChairViewModel } from "../models/ChairViewModel";
import type { MediaEntity } from "./MediaEntity";

export class ChairEntity implements IEntity {
  public constructor(
    public readonly model: ChairViewModel,
    public readonly medias: MediaEntity[],
  ) {}
}
