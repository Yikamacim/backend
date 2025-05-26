import type { IEntity } from "../../app/interfaces/IEntity";
import type { SofaViewModel } from "../models/SofaViewModel";
import type { MediaEntity } from "./MediaEntity";

export class SofaEntity implements IEntity {
  public constructor(
    public readonly model: SofaViewModel,
    public readonly medias: MediaEntity[],
  ) {}
}
