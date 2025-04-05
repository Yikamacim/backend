import type { IModel } from "../../app/interfaces/IModel";
import { ModelMismatchError, UnexpectedQueryResultError } from "../../app/schemas/ServerError";
import { MediaType } from "../enums/MediaType";

export class ItemMediaViewModel implements IModel {
  private constructor(
    public readonly itemId: number,
    public readonly mediaId: number,
    public readonly mediaType: MediaType,
    public readonly extension: string,
  ) {}

  public static fromRecord(record: unknown): ItemMediaViewModel {
    if (!record) {
      throw new UnexpectedQueryResultError();
    }
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

  public static fromRecords(records: unknown[]): ItemMediaViewModel[] {
    if (!this.areValidModels(records)) {
      throw new ModelMismatchError(records);
    }
    return records.map((record: unknown): ItemMediaViewModel => this.fromRecord(record));
  }

  private static isValidModel(data: unknown): data is ItemMediaViewModel {
    if (typeof data !== "object" || data === null) {
      return false;
    }
    const model = data as ItemMediaViewModel;
    return (
      typeof model.itemId === "number" &&
      typeof model.mediaId === "number" &&
      Object.values(MediaType).includes(model.mediaType) &&
      typeof model.extension === "string"
    );
  }

  private static areValidModels(data: unknown[]): data is ItemMediaViewModel[] {
    if (!Array.isArray(data)) {
      return false;
    }
    return data.every((item: unknown): boolean => this.isValidModel(item));
  }
}
