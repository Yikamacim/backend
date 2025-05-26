import type { IResponse } from "../../../../app/interfaces/IResponse";
import type { ChairEntity } from "../../../../common/entities/ChairEntity";
import type { EMediaType } from "../../../../common/enums/EMediaType";

export class MyChairsResponse implements IResponse {
  private constructor(
    public readonly chairId: number,
    public readonly name: string,
    public readonly description: string,
    public readonly medias: {
      readonly mediaId: number;
      readonly mediaType: EMediaType;
      readonly extension: string;
      readonly url: string;
    }[],
    public readonly quantity: number,
  ) {}

  public static fromEntity(entity: ChairEntity): MyChairsResponse {
    return new MyChairsResponse(
      entity.model.chairId,
      entity.model.name,
      entity.model.description,
      entity.medias,
      entity.model.quantity,
    );
  }

  public static fromEntities(entities: ChairEntity[]): MyChairsResponse[] {
    return entities.map((entity) => MyChairsResponse.fromEntity(entity));
  }
}
