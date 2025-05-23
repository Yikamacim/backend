import type { IModel } from "../../app/interfaces/IModel";
import { ModelMismatchError } from "../../app/schemas/ServerError";
import { ProtoUtil } from "../../app/utils/ProtoUtil";

export class HoursModel implements IModel {
  protected constructor(
    public readonly businessId: number,
    public readonly mondayFrom: string | null,
    public readonly mondayTo: string | null,
    public readonly tuesdayFrom: string | null,
    public readonly tuesdayTo: string | null,
    public readonly wednesdayFrom: string | null,
    public readonly wednesdayTo: string | null,
    public readonly thursdayFrom: string | null,
    public readonly thursdayTo: string | null,
    public readonly fridayFrom: string | null,
    public readonly fridayTo: string | null,
    public readonly saturdayFrom: string | null,
    public readonly saturdayTo: string | null,
    public readonly sundayFrom: string | null,
    public readonly sundayTo: string | null,
  ) {}

  public static fromRecord(record: unknown): HoursModel {
    if (!this.isValidModel(record)) {
      throw new ModelMismatchError(record);
    }
    return new HoursModel(
      record.businessId,
      record.mondayFrom,
      record.mondayTo,
      record.tuesdayFrom,
      record.tuesdayTo,
      record.wednesdayFrom,
      record.wednesdayTo,
      record.thursdayFrom,
      record.thursdayTo,
      record.fridayFrom,
      record.fridayTo,
      record.saturdayFrom,
      record.saturdayTo,
      record.sundayFrom,
      record.sundayTo,
    );
  }

  public static fromRecords(records: unknown[]): HoursModel[] {
    if (!this.areValidModels(records)) {
      throw new ModelMismatchError(records);
    }
    return records.map((record: unknown): HoursModel => this.fromRecord(record));
  }

  protected static isValidModel(data: unknown): data is HoursModel {
    if (!ProtoUtil.isProtovalid(data) || typeof data !== "object") {
      return false;
    }
    const model = data as HoursModel;
    return (
      typeof model.businessId === "number" &&
      (model.mondayFrom === null || typeof model.mondayFrom === "string") &&
      (model.mondayTo === null || typeof model.mondayTo === "string") &&
      (model.tuesdayFrom === null || typeof model.tuesdayFrom === "string") &&
      (model.tuesdayTo === null || typeof model.tuesdayTo === "string") &&
      (model.wednesdayFrom === null || typeof model.wednesdayFrom === "string") &&
      (model.wednesdayTo === null || typeof model.wednesdayTo === "string") &&
      (model.thursdayFrom === null || typeof model.thursdayFrom === "string") &&
      (model.thursdayTo === null || typeof model.thursdayTo === "string") &&
      (model.fridayFrom === null || typeof model.fridayFrom === "string") &&
      (model.fridayTo === null || typeof model.fridayTo === "string") &&
      (model.saturdayFrom === null || typeof model.saturdayFrom === "string") &&
      (model.saturdayTo === null || typeof model.saturdayTo === "string") &&
      (model.sundayFrom === null || typeof model.sundayFrom === "string") &&
      (model.sundayTo === null || typeof model.sundayTo === "string")
    );
  }

  protected static areValidModels(data: unknown[]): data is HoursModel[] {
    if (!Array.isArray(data)) {
      return false;
    }
    return data.every((item: unknown) => this.isValidModel(item));
  }
}
