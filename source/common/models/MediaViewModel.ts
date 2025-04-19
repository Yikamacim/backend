import type { IModel } from "../../app/interfaces/IModel";
import { ModelMismatchError } from "../../app/schemas/ServerError";
import { ProtoUtil } from "../../app/utils/ProtoUtil";
import { MediaType } from "../enums/MediaType";

export class MediaViewModel implements IModel {
  private constructor(
    public readonly mediaId: number,
    public readonly accountId: number,
    public readonly mediaType: MediaType,
    public readonly extension: string,
    public readonly isUsed: boolean,
    public readonly createdAt: Date,
  ) {}

  public static fromRecord(record: unknown): MediaViewModel {
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

  public static fromRecords(records: unknown[]): MediaViewModel[] {
    if (!this.areValidModels(records)) {
      throw new ModelMismatchError(records);
    }
    return records.map((record: unknown): MediaViewModel => this.fromRecord(record));
  }

  private static isValidModel(data: unknown): data is MediaViewModel {
    if (!ProtoUtil.isProtovalid(data) || typeof data !== "object") {
      return false;
    }
    const model = data as MediaViewModel;
    return (
      typeof model.mediaId === "number" &&
      typeof model.accountId === "number" &&
      Object.values(MediaType).includes(model.mediaType) &&
      typeof model.extension === "string" &&
      typeof model.isUsed === "boolean" &&
      model.createdAt instanceof Date
    );
  }

  private static areValidModels(data: unknown[]): data is MediaViewModel[] {
    if (!Array.isArray(data)) {
      return false;
    }
    return data.every((item: unknown): boolean => this.isValidModel(item));
  }
}
