import type { IResponse } from "../../../../app/interfaces/IResponse";
import type { CarpetEntity } from "../../../../common/entities/CarpetEntity";
import type { ECarpetMaterial } from "../../../../common/enums/ECarpetMaterial";
import type { EMediaType } from "../../../../common/enums/EMediaType";

export class MyCarpetsResponse implements IResponse {
  private constructor(
    public readonly carpetId: number,
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
    public readonly carpetMaterial: ECarpetMaterial | null,
  ) {}

  public static fromEntity(entity: CarpetEntity): MyCarpetsResponse {
    return new MyCarpetsResponse(
      entity.model.carpetId,
      entity.model.name,
      entity.model.description,
      entity.medias,
      entity.model.width,
      entity.model.length,
      entity.model.carpetMaterial,
    );
  }

  public static fromEntities(entities: CarpetEntity[]): MyCarpetsResponse[] {
    return entities.map((entity) => MyCarpetsResponse.fromEntity(entity));
  }
}
