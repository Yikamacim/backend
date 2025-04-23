import type { IModel } from "../../app/interfaces/IModel";
import { ModelMismatchError } from "../../app/schemas/ServerError";
import { MediaBase } from "../bases/MediaBase";
import type { MediaType } from "../enums/MediaType";

export class BusinessMediaViewModel extends MediaBase implements IModel {
  protected constructor(
    public readonly businessId: number,
    mediaId: number,
    mediaType: MediaType,
    extension: string,
    public readonly isMain: boolean,
  ) {
    super(mediaId, mediaType, extension);
  }

  public static override fromRecord(record: unknown): BusinessMediaViewModel {
    if (!this.isValidModel(record)) {
      throw new ModelMismatchError(record);
    }
    return new BusinessMediaViewModel(
      record.businessId,
      record.mediaId,
      record.mediaType,
      record.extension,
      record.isMain,
    );
  }

  public static override fromRecords(records: unknown[]): BusinessMediaViewModel[] {
    if (!this.areValidModels(records)) {
      throw new ModelMismatchError(records);
    }
    return records.map((record: unknown): BusinessMediaViewModel => this.fromRecord(record));
  }

  protected static override isValidModel(data: unknown): data is BusinessMediaViewModel {
    const isSuperValid = super.isValidModel(data);
    const model = data as BusinessMediaViewModel;
    return (
      isSuperValid && typeof model.businessId === "number" && typeof model.isMain === "boolean"
    );
  }

  protected static override areValidModels(data: unknown[]): data is BusinessMediaViewModel[] {
    if (!Array.isArray(data)) {
      return false;
    }
    return data.every((item: unknown): boolean => this.isValidModel(item));
  }
}
