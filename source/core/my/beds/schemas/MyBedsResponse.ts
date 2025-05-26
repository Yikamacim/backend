import type { IResponse } from "../../../../app/interfaces/IResponse";
import type { BedEntity } from "../../../../common/entities/BedEntity";
import type { EBedSize } from "../../../../common/enums/EBedSize";
import type { EMediaType } from "../../../../common/enums/EMediaType";

export class MyBedsResponse implements IResponse {
  private constructor(
    public readonly bedId: number,
    public readonly name: string,
    public readonly description: string,
    public readonly medias: {
      readonly mediaId: number;
      readonly mediaType: EMediaType;
      readonly extension: string;
      readonly url: string;
    }[],
    public readonly bedSize: EBedSize | null,
  ) {}

  public static fromEntity(entity: BedEntity): MyBedsResponse {
    return new MyBedsResponse(
      entity.model.bedId,
      entity.model.name,
      entity.model.description,
      entity.medias,
      entity.model.bedSize,
    );
  }

  public static fromEntities(entities: BedEntity[]): MyBedsResponse[] {
    return entities.map((entity) => this.fromEntity(entity));
  }
}
