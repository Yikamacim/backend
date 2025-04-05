import type { IModel } from "../../app/interfaces/IModel";
import { ModelMismatchError, UnexpectedQueryResultError } from "../../app/schemas/ServerError";
import { MediaType } from "../enums/MediaType";

export class MediaModel implements IModel {
  private constructor(
    public readonly mediaId: number,
    public readonly accountId: number,
    public readonly mediaType: MediaType,
    public readonly extension: string,
    public readonly isUsed: boolean,
    public readonly createdAt: Date,
  ) {}

  public static fromRecord(record: unknown): MediaModel {
    if (!record) {
      throw new UnexpectedQueryResultError();
    }
    if (!this.isValidModel(record)) {
      throw new ModelMismatchError(record);
    }
    return new MediaModel(
      record.mediaId,
      record.accountId,
      record.mediaType,
      record.extension,
      record.isUsed,
      record.createdAt,
    );
  }

  public static fromRecords(records: unknown[]): MediaModel[] {
    if (!this.areValidModels(records)) {
      throw new ModelMismatchError(records);
    }
    return records.map((record: unknown): MediaModel => this.fromRecord(record));
  }

  private static isValidModel(data: unknown): data is MediaModel {
    if (typeof data !== "object" || data === null) {
      return false;
    }
    const model = data as MediaModel;
    return (
      typeof model.mediaId === "number" &&
      typeof model.accountId === "number" &&
      Object.values(MediaType).includes(model.mediaType) &&
      typeof model.extension === "string" &&
      typeof model.isUsed === "boolean" &&
      model.createdAt instanceof Date
    );
  }

  private static areValidModels(data: unknown[]): data is MediaModel[] {
    if (!Array.isArray(data)) {
      return false;
    }
    return data.every((item: unknown): boolean => this.isValidModel(item));
  }
}
