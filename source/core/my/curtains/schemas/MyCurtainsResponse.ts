import type { MediaData } from "../../../../@types/medias";
import type { IResponse } from "../../../../app/interfaces/IResponse";
import type { CurtainMaterial } from "../../../../common/enums/CurtainMaterial";
import type { CurtainType } from "../../../../common/enums/CurtainType";
import type { CurtainViewModel } from "../../../../common/models/CurtainViewModel";

export class MyCurtainsResponse implements IResponse {
  private constructor(
    public readonly curtainId: number,
    public readonly name: string,
    public readonly description: string,
    public readonly medias: MediaData[],
    public readonly width: number | null,
    public readonly length: number | null,
    public readonly curtainType: CurtainType | null,
    public readonly curtain: CurtainMaterial | null,
  ) {}

  public static fromModel(model: CurtainViewModel, medias: MediaData[]): MyCurtainsResponse {
    return new MyCurtainsResponse(
      model.curtainId,
      model.name,
      model.description,
      medias,
      model.width,
      model.length,
      model.curtainType,
      model.curtainMaterial,
    );
  }
}
