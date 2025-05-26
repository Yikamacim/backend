import type { IResponse } from "../../../../app/interfaces/IResponse";
import type { QuiltEntity } from "../../../../common/entities/QuiltEntity";
import type { EMediaType } from "../../../../common/enums/EMediaType";
import type { EQuiltMaterial } from "../../../../common/enums/EQuiltMaterial";
import type { EQuiltSize } from "../../../../common/enums/EQuiltSize";

export class MyQuiltsResponse implements IResponse {
  private constructor(
    public readonly quiltId: number,
    public readonly name: string,
    public readonly description: string,
    public readonly medias: {
      readonly mediaId: number;
      readonly mediaType: EMediaType;
      readonly extension: string;
      readonly url: string;
    }[],
    public readonly quiltSize: EQuiltSize | null,
    public readonly quiltMaterial: EQuiltMaterial | null,
  ) {}

  public static fromEntiity(entity: QuiltEntity): MyQuiltsResponse {
    return new MyQuiltsResponse(
      entity.model.quiltId,
      entity.model.name,
      entity.model.description,
      entity.medias,
      entity.model.quiltSize,
      entity.model.quiltMaterial,
    );
  }

  public static fromEntities(entities: QuiltEntity[]): MyQuiltsResponse[] {
    return entities.map((entity) => MyQuiltsResponse.fromEntiity(entity));
  }
}
