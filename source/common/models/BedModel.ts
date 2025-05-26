import type { IModel } from "../../app/interfaces/IModel";
import { ModelMismatchError } from "../../app/schemas/ServerError";
import { ProtoUtil } from "../../app/utils/ProtoUtil";
import { EBedSize } from "../enums/EBedSize";

export class BedModel implements IModel {
  protected constructor(
    public readonly bedId: number,
    public readonly itemId: number,
    public readonly bedSize: EBedSize | null,
  ) {}

  public static fromRecord(record: unknown): BedModel {
    if (!this.isValidModel(record)) {
      throw new ModelMismatchError(record);
    }
    return new BedModel(record.bedId, record.itemId, record.bedSize);
  }

  public static fromRecords(records: unknown[]): BedModel[] {
    if (!this.areValidModels(records)) {
      throw new ModelMismatchError(records);
    }
    return records.map((record: unknown): BedModel => this.fromRecord(record));
  }

  protected static isValidModel(data: unknown): data is BedModel {
    if (!ProtoUtil.isProtovalid(data) || typeof data !== "object") {
      return false;
    }
    const model = data as BedModel;
    return (
      typeof model.bedId === "number" &&
      typeof model.itemId === "number" &&
      (model.bedSize === null || Object.values(EBedSize).includes(model.bedSize))
    );
  }

  protected static areValidModels(data: unknown[]): data is BedModel[] {
    if (!Array.isArray(data)) {
      return false;
    }
    return data.every((item: unknown) => this.isValidModel(item));
  }
}
