import type { IResponse } from "../../../../app/interfaces/IResponse";
import type { BlanketEntity } from "../../../../common/entities/BlanketEntity";
import type { EBlanketMaterial } from "../../../../common/enums/EBlanketMaterial";
import type { EBlanketSize } from "../../../../common/enums/EBlanketSize";
import type { EMediaType } from "../../../../common/enums/EMediaType";

export class MyBlanketsResponse implements IResponse {
  private constructor(
    public readonly blanketId: number,
    public readonly name: string,
    public readonly description: string,
    public readonly medias: {
      readonly mediaId: number;
      readonly mediaType: EMediaType;
      readonly extension: string;
      readonly url: string;
    }[],
    public readonly blanketSize: EBlanketSize | null,
    public readonly blanketMaterial: EBlanketMaterial | null,
  ) {}

  public static fromEntity(entity: BlanketEntity): MyBlanketsResponse {
    return new MyBlanketsResponse(
      entity.model.blanketId,
      entity.model.name,
      entity.model.description,
      entity.medias,
      entity.model.blanketSize,
      entity.model.blanketMaterial,
    );
  }

  public static fromEntities(entities: BlanketEntity[]): MyBlanketsResponse[] {
    return entities.map((entity) => MyBlanketsResponse.fromEntity(entity));
  }
}
