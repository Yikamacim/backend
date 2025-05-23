import type { IModel } from "../../app/interfaces/IModel";
import { ModelMismatchError } from "../../app/schemas/ServerError";
import { MediaBase } from "../bases/MediaBase";
import type { MediaType } from "../enums/MediaType";

export class ApprovalMediaViewModel extends MediaBase implements IModel {
  protected constructor(
    public readonly businessId: number,
    mediaId: number,
    mediaType: MediaType,
    extension: string,
  ) {
    super(mediaId, mediaType, extension);
  }

  public static override fromRecord(record: unknown): ApprovalMediaViewModel {
    if (!this.isValidModel(record)) {
      throw new ModelMismatchError(record);
    }
    return new ApprovalMediaViewModel(
      record.businessId,
      record.mediaId,
      record.mediaType,
      record.extension,
    );
  }

  public static override fromRecords(records: unknown[]): ApprovalMediaViewModel[] {
    if (!this.areValidModels(records)) {
      throw new ModelMismatchError(records);
    }
    return records.map((record: unknown): ApprovalMediaViewModel => this.fromRecord(record));
  }

  protected static override isValidModel(data: unknown): data is ApprovalMediaViewModel {
    const isSuperValid = super.isValidModel(data);
    const model = data as ApprovalMediaViewModel;
    return isSuperValid && typeof model.businessId === "number";
  }

  protected static override areValidModels(data: unknown[]): data is ApprovalMediaViewModel[] {
    if (!Array.isArray(data)) {
      return false;
    }
    return data.every((item: unknown) => this.isValidModel(item));
  }
}
