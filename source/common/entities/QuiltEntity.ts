import type { IEntity } from "../../app/interfaces/IEntity";
import type { QuiltViewModel } from "../models/QuiltViewModel";
import type { MediaEntity } from "./MediaEntity";

export class QuiltEntity implements IEntity {
  public constructor(
    public readonly model: QuiltViewModel,
    public readonly medias: MediaEntity[],
  ) {}
}
