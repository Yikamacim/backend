import type { IEntity } from "../../app/interfaces/IEntity";
import type { CampaignModel } from "../models/CampaignModel";
import type { MediaEntity } from "./MediaEntity";

export class CampaignEntity implements IEntity {
  public constructor(
    public readonly model: CampaignModel,
    public readonly media: MediaEntity,
  ) {}
}
