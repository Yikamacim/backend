import type { MediaData } from "../../../../@types/medias";
import type { IResponse } from "../../../../app/interfaces/IResponse";
import type { QuiltMaterial } from "../../../../common/enums/QuiltMaterial";
import type { QuiltSize } from "../../../../common/enums/QuiltSize";
import type { QuiltViewModel } from "../../../../common/models/QuiltViewModel";

export class MyQuiltsResponse implements IResponse {
  private constructor(
    public readonly quiltId: number,
    public readonly name: string,
    public readonly description: string,
    public readonly medias: MediaData[],
    public readonly quiltSize: QuiltSize | null,
    public readonly quiltMaterial: QuiltMaterial | null,
  ) {}

  public static fromModel(model: QuiltViewModel, medias: MediaData[]): MyQuiltsResponse {
    return new MyQuiltsResponse(
      model.quiltId,
      model.name,
      model.description,
      medias,
      model.quiltSize,
      model.quiltMaterial,
    );
  }
}
