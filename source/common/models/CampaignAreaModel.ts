import type { IModel } from "../../app/interfaces/IModel";
import { ModelMismatchError } from "../../app/schemas/ServerError";
import { ProtoUtil } from "../../app/utils/ProtoUtil";

export class CampaignAreaModel implements IModel {
  protected constructor(
    public readonly campaignId: number,
    public readonly businessId: number,
    public readonly title: string,
    public readonly mediaId: number,
    public readonly description: string,
    public readonly releaseDate: Date,
    public readonly neighborhoodId: number,
  ) {}

  public static fromRecord(record: unknown): CampaignAreaModel {
    if (!this.isValidModel(record)) {
      throw new ModelMismatchError(record);
    }
    return new CampaignAreaModel(
      record.campaignId,
      record.businessId,
      record.title,
      record.mediaId,
      record.description,
      record.releaseDate,
      record.neighborhoodId,
    );
  }

  public static fromRecords(records: unknown[]): CampaignAreaModel[] {
    if (!this.areValidModels(records)) {
      throw new ModelMismatchError(records);
    }
    return records.map((record: unknown): CampaignAreaModel => this.fromRecord(record));
  }

  protected static isValidModel(data: unknown): data is CampaignAreaModel {
    if (!ProtoUtil.isProtovalid(data) || typeof data !== "object") {
      return false;
    }
    const model = data as CampaignAreaModel;
    return (
      typeof model.campaignId === "number" &&
      typeof model.businessId === "number" &&
      typeof model.title === "string" &&
      typeof model.mediaId === "number" &&
      typeof model.description === "string" &&
      model.releaseDate instanceof Date &&
      typeof model.neighborhoodId === "number"
    );
  }

  protected static areValidModels(data: unknown[]): data is CampaignAreaModel[] {
    if (!Array.isArray(data)) {
      return false;
    }
    return data.every((item: unknown) => this.isValidModel(item));
  }
}
