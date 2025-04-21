import type { IBase } from "../../app/interfaces/IBase";
import { ModelMismatchError } from "../../app/schemas/ServerError";
import { ProtoUtil } from "../../app/utils/ProtoUtil";
import { MediaType } from "../enums/MediaType";

export class MediaBase implements IBase {
  protected constructor(
    public readonly mediaId: number,
    public readonly mediaType: MediaType,
    public readonly extension: string,
  ) {}

  public static fromRecord(record: unknown): MediaBase {
    if (!this.isValidModel(record)) {
      throw new ModelMismatchError(record);
    }
    return new MediaBase(record.mediaId, record.mediaType, record.extension);
  }

  public static fromRecords(records: unknown[]): MediaBase[] {
    if (!this.areValidModels(records)) {
      throw new ModelMismatchError(records);
    }
    return records.map((record: unknown): MediaBase => this.fromRecord(record));
  }

  protected static isValidModel(data: unknown): data is MediaBase {
    if (!ProtoUtil.isProtovalid(data) || typeof data !== "object") {
      return false;
    }
    const model = data as MediaBase;
    return (
      typeof model.mediaId === "number" &&
      Object.values(MediaType).includes(model.mediaType) &&
      typeof model.extension === "string"
    );
  }

  protected static areValidModels(data: unknown[]): data is MediaBase[] {
    if (!Array.isArray(data)) {
      return false;
    }
    return data.every((item: unknown): boolean => this.isValidModel(item));
  }
}
