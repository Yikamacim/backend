import type { MediaData } from "../../../../@types/medias";
import type { IResponse } from "../../../../app/interfaces/IResponse";
import type { CarpetMaterial } from "../../../../common/enums/CarpetMaterial";
import type { CarpetViewModel } from "../../../../common/models/CarpetViewModel";

export class MyCarpetsResponse implements IResponse {
  private constructor(
    public readonly carpetId: number,
    public readonly name: string,
    public readonly description: string,
    public readonly medias: MediaData[],
    public readonly width: number | null,
    public readonly length: number | null,
    public readonly carpetMaterial: CarpetMaterial | null,
  ) {}

  public static fromModel(model: CarpetViewModel, medias: MediaData[]): MyCarpetsResponse {
    return new MyCarpetsResponse(
      model.carpetId,
      model.name,
      model.description,
      medias,
      model.width,
      model.length,
      model.carpetMaterial,
    );
  }
}
