import type { MediaData } from "../../../../@types/medias";
import type { IResponse } from "../../../../app/interfaces/IResponse";
import type { BedType } from "../../../../common/enums/BedType";
import type { BedViewModel } from "../../../../common/models/BedViewModel";

export class MyBedsResponse implements IResponse {
  private constructor(
    public readonly bedId: number,
    public readonly name: string,
    public readonly description: string,
    public readonly medias: MediaData[],
    public readonly bedType: BedType | null,
  ) {}

  public static fromModel(model: BedViewModel, medias: MediaData[]): MyBedsResponse {
    return new MyBedsResponse(model.bedId, model.name, model.description, medias, model.bedType);
  }
}
