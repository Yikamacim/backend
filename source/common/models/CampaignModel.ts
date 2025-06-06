import type { IModel } from "../../app/interfaces/IModel";
import { ModelMismatchError } from "../../app/schemas/ServerError";
import { ProtoUtil } from "../../app/utils/ProtoUtil";

export class CampaignModel implements IModel {
  protected constructor(
    public readonly campaignId: number,
    public readonly businessId: number,
    public readonly title: string,
    public readonly mediaId: number,
    public readonly description: string,
    public readonly releaseDate: Date,
  ) {}

  public static fromRecord(record: unknown): CampaignModel {
    if (!this.isValidModel(record)) {
      throw new ModelMismatchError(record);
    }
    return new CampaignModel(
      record.campaignId,
      record.businessId,
      record.title,
      record.mediaId,
      record.description,
      record.releaseDate,
    );
  }

  public static fromRecords(records: unknown[]): CampaignModel[] {
    if (!this.areValidModels(records)) {
      throw new ModelMismatchError(records);
    }
    return records.map((record: unknown): CampaignModel => this.fromRecord(record));
  }

  protected static isValidModel(data: unknown): data is CampaignModel {
    if (!ProtoUtil.isProtovalid(data) || typeof data !== "object") {
      return false;
    }
    const model = data as CampaignModel;
    return (
      typeof model.campaignId === "number" &&
      typeof model.businessId === "number" &&
      typeof model.title === "string" &&
      typeof model.mediaId === "number" &&
      typeof model.description === "string" &&
      model.releaseDate instanceof Date
    );
  }

  protected static areValidModels(data: unknown[]): data is CampaignModel[] {
    if (!Array.isArray(data)) {
      return false;
    }
    return data.every((item: unknown) => this.isValidModel(item));
  }
}
