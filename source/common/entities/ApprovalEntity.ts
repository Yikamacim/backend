import type { IEntity } from "../../app/interfaces/IEntity";
import type { MediaEntity } from "../../common/entities/MediaEntity";
import type { ApprovalModel } from "../../common/models/ApprovalModel";

export class ApprovalEntity implements IEntity {
  public constructor(
    public readonly model: ApprovalModel,
    public readonly medias: MediaEntity[],
  ) {}
}
