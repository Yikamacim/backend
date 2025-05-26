import type { IResponse } from "../../../../app/interfaces/IResponse";
import type { CurtainEntity } from "../../../../common/entities/CurtainEntity";
import type { ECurtainType } from "../../../../common/enums/ECurtainType";
import type { EMediaType } from "../../../../common/enums/EMediaType";

export class MyCurtainsResponse implements IResponse {
  private constructor(
    public readonly curtainId: number,
    public readonly name: string,
    public readonly description: string,
    public readonly medias: {
      readonly mediaId: number;
      readonly mediaType: EMediaType;
      readonly extension: string;
      readonly url: string;
    }[],
    public readonly width: number | null,
    public readonly length: number | null,
    public readonly curtainType: ECurtainType | null,
  ) {}

  public static fromEntity(entity: CurtainEntity): MyCurtainsResponse {
    return new MyCurtainsResponse(
      entity.model.curtainId,
      entity.model.name,
      entity.model.description,
      entity.medias,
      entity.model.width,
      entity.model.length,
      entity.model.curtainType,
    );
  }

  public static fromEntities(entities: CurtainEntity[]): MyCurtainsResponse[] {
    return entities.map((entity) => MyCurtainsResponse.fromEntity(entity));
  }
}
