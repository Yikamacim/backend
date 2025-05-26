import type { IEntity } from "../../app/interfaces/IEntity";
import type { ServiceModel } from "../models/ServiceModel";
import type { MediaEntity } from "./MediaEntity";

export class ServiceEntity implements IEntity {
  public constructor(
    public readonly model: ServiceModel,
    public readonly media: MediaEntity | null,
  ) {}
}
