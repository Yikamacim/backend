import type { MediaData } from "../../../../@types/medias";
import type { IResponse } from "../../../../app/interfaces/IResponse";
import type { BedSize } from "../../../../common/enums/BedSize";
import type { BedViewModel } from "../../../../common/models/BedViewModel";

export class MyBedsResponse implements IResponse {
  private constructor(
    public readonly bedId: number,
    public readonly name: string,
    public readonly description: string,
    public readonly medias: MediaData[],
    public readonly bedSize: BedSize | null,
  ) {}

  public static fromModel(model: BedViewModel, mediaDatas: MediaData[]): MyBedsResponse {
    return new MyBedsResponse(
      model.bedId,
      model.name,
      model.description,
      mediaDatas,
      model.bedSize,
    );
  }
}
