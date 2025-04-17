import type { MediaData } from "../../../../@types/medias";
import type { IResponse } from "../../../../app/interfaces/IResponse";
import type { SofaType } from "../../../../common/enums/SofaType";
import type { SofaViewModel } from "../../../../common/models/SofaViewModel";

export class MySofasResponse implements IResponse {
  private constructor(
    public readonly sofaId: number,
    public readonly name: string,
    public readonly description: string,
    public readonly medias: MediaData[],
    public readonly isCushioned: boolean | null,
    public readonly sofaType: SofaType | null,
    public readonly sofaMaterial: string | null,
  ) {}

  public static fromModel(model: SofaViewModel, medias: MediaData[]): MySofasResponse {
    return new MySofasResponse(
      model.sofaId,
      model.name,
      model.description,
      medias,
      model.isCushioned,
      model.sofaType,
      model.sofaMaterial,
    );
  }
}
