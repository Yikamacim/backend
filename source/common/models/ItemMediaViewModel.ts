import type { IModel } from "../../app/interfaces/IModel";
import { ModelMismatchError } from "../../app/schemas/ServerError";
import { MediaBase } from "../bases/MediaBase";
import { MediaType } from "../enums/MediaType";

export class ItemMediaViewModel extends MediaBase implements IModel {
  protected constructor(
    public readonly itemId: number,
    mediaId: number,
    mediaType: MediaType,
    extension: string,
  ) {
    super(mediaId, mediaType, extension);
  }

  public static override fromRecord(record: unknown): ItemMediaViewModel {
    if (!this.isValidModel(record)) {
      throw new ModelMismatchError(record);
    }
    return new ItemMediaViewModel(
      record.itemId,
      record.mediaId,
      record.mediaType,
      record.extension,
    );
  }

  public static override fromRecords(records: unknown[]): ItemMediaViewModel[] {
    if (!this.areValidModels(records)) {
      throw new ModelMismatchError(records);
    }
    return records.map((record: unknown): ItemMediaViewModel => this.fromRecord(record));
  }

  protected static override isValidModel(data: unknown): data is ItemMediaViewModel {
    const isSuperValid = super.isValidModel(data);
    const model = data as ItemMediaViewModel;
    return isSuperValid && typeof model.itemId === "number";
  }

  protected static override areValidModels(data: unknown[]): data is ItemMediaViewModel[] {
    if (!Array.isArray(data)) {
      return false;
    }
    return data.every((item: unknown): boolean => this.isValidModel(item));
  }
}
