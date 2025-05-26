import type { IResponse } from "../../../../app/interfaces/IResponse";
import type { SofaEntity } from "../../../../common/entities/SofaEntity";
import type { EMediaType } from "../../../../common/enums/EMediaType";
import type { ESofaType } from "../../../../common/enums/ESofaType";

export class MySofasResponse implements IResponse {
  private constructor(
    public readonly sofaId: number,
    public readonly name: string,
    public readonly description: string,
    public readonly medias: {
      readonly mediaId: number;
      readonly mediaType: EMediaType;
      readonly extension: string;
      readonly url: string;
    }[],
    public readonly isCushioned: boolean | null,
    public readonly sofaType: ESofaType | null,
    public readonly sofaMaterial: string | null,
  ) {}

  public static fromEntity(entity: SofaEntity): MySofasResponse {
    return new MySofasResponse(
      entity.model.sofaId,
      entity.model.name,
      entity.model.description,
      entity.medias,
      entity.model.isCushioned,
      entity.model.sofaType,
      entity.model.sofaMaterial,
    );
  }

  public static fromEntities(entities: SofaEntity[]): MySofasResponse[] {
    return entities.map((entity) => MySofasResponse.fromEntity(entity));
  }
}
