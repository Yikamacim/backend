import type { MediaData } from "../../../../@types/medias";
import type { IResponse } from "../../../../app/interfaces/IResponse";
import type { ChairViewModel } from "../../../../common/models/ChairViewModel";

export class MyChairsResponse implements IResponse {
  private constructor(
    public readonly chairId: number,
    public readonly name: string,
    public readonly description: string,
    public readonly medias: MediaData[],
    public readonly quantity: number,
  ) {}

  public static fromModel(model: ChairViewModel, medias: MediaData[]): MyChairsResponse {
    return new MyChairsResponse(
      model.chairId,
      model.name,
      model.description,
      medias,
      model.quantity,
    );
  }
}
