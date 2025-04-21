import type { IModel } from "../../app/interfaces/IModel";
import { ModelMismatchError } from "../../app/schemas/ServerError";
import { MediaBase } from "../bases/MediaBase";
import { MediaType } from "../enums/MediaType";

export class MediaModel extends MediaBase implements IModel {
  protected constructor(
    mediaId: number,
    public readonly accountId: number,
    mediaType: MediaType,
    extension: string,
    public readonly createdAt: Date,
  ) {
    super(mediaId, mediaType, extension);
  }

  public static override fromRecord(record: unknown): MediaModel {
    if (!this.isValidModel(record)) {
      throw new ModelMismatchError(record);
    }
    return new MediaModel(
      record.mediaId,
      record.accountId,
      record.mediaType,
      record.extension,
      record.createdAt,
    );
  }

  public static override fromRecords(records: unknown[]): MediaModel[] {
    if (!this.areValidModels(records)) {
      throw new ModelMismatchError(records);
    }
    return records.map((record: unknown): MediaModel => this.fromRecord(record));
  }

  protected static override isValidModel(data: unknown): data is MediaModel {
    const isSuperValid = super.isValidModel(data);
    const model = data as MediaModel;
    return isSuperValid && typeof model.accountId === "number" && model.createdAt instanceof Date;
  }

  protected static override areValidModels(data: unknown[]): data is MediaModel[] {
    if (!Array.isArray(data)) {
      return false;
    }
    return data.every((item: unknown): boolean => this.isValidModel(item));
  }
}
