import type { MediaData } from "../../../../@types/medias";
import type { IResponse } from "../../../../app/interfaces/IResponse";
import type { BlanketMaterial } from "../../../../common/enums/BlanketMaterial";
import type { BlanketSize } from "../../../../common/enums/BlanketSize";
import type { BlanketViewModel } from "../../../../common/models/BlanketViewModel";

export class MyBlanketsResponse implements IResponse {
  private constructor(
    public readonly blanketId: number,
    public readonly name: string,
    public readonly description: string,
    public readonly medias: MediaData[],
    public readonly blanketSize: BlanketSize | null,
    public readonly blanketMaterial: BlanketMaterial | null,
  ) {}

  public static fromModel(model: BlanketViewModel, medias: MediaData[]): MyBlanketsResponse {
    return new MyBlanketsResponse(
      model.blanketId,
      model.name,
      model.description,
      medias,
      model.blanketSize,
      model.blanketMaterial,
    );
  }
}
