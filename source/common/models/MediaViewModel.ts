import type { IModel } from "../../app/interfaces/IModel";
import { ModelMismatchError } from "../../app/schemas/ServerError";
import { MediaBase } from "../bases/MediaBase";
import { EMediaType } from "../enums/EMediaType";

export class MediaViewModel extends MediaBase implements IModel {
  protected constructor(
    mediaId: number,
    public readonly accountId: number,
    mediaType: EMediaType,
    extension: string,
    public readonly isUsed: boolean,
    public readonly createdAt: Date,
  ) {
    super(mediaId, mediaType, extension);
  }

  public static override fromRecord(record: unknown): MediaViewModel {
    if (!this.isValidModel(record)) {
      throw new ModelMismatchError(record);
    }
    return new MediaViewModel(
      record.mediaId,
      record.accountId,
      record.mediaType,
      record.extension,
      record.isUsed,
      record.createdAt,
    );
  }

  public static override fromRecords(records: unknown[]): MediaViewModel[] {
    if (!this.areValidModels(records)) {
      throw new ModelMismatchError(records);
    }
    return records.map((record: unknown): MediaViewModel => this.fromRecord(record));
  }

  protected static override isValidModel(data: unknown): data is MediaViewModel {
    const isSuperValid = super.isValidModel(data);
    const model = data as MediaViewModel;
    return (
      isSuperValid &&
      typeof model.accountId === "number" &&
      typeof model.isUsed === "boolean" &&
      model.createdAt instanceof Date
    );
  }

  protected static override areValidModels(data: unknown[]): data is MediaViewModel[] {
    if (!Array.isArray(data)) {
      return false;
    }
    return data.every((item: unknown) => this.isValidModel(item));
  }
}
