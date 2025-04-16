import type { IModel } from "../../app/interfaces/IModel";
import { ModelMismatchError } from "../../app/schemas/ServerError";
import { ProtoUtil } from "../../app/utils/ProtoUtil";
import { BedType } from "../enums/BedType";

export class BedViewModel implements IModel {
  private constructor(
    public readonly bedId: number,
    public readonly accountId: number,
    public readonly itemId: number,
    public readonly name: string,
    public readonly description: string,
    public readonly bedType: BedType | null,
  ) {}

  public static fromRecord(record: unknown): BedViewModel {
    if (!this.isValidModel(record)) {
      throw new ModelMismatchError(record);
    }
    return new BedViewModel(
      record.bedId,
      record.accountId,
      record.itemId,
      record.name,
      record.description,
      record.bedType,
    );
  }

  public static fromRecords(records: unknown[]): BedViewModel[] {
    if (!this.areValidModels(records)) {
      throw new ModelMismatchError(records);
    }
    return records.map((record: unknown): BedViewModel => this.fromRecord(record));
  }

  private static isValidModel(data: unknown): data is BedViewModel {
    if (!ProtoUtil.isProtovalid(data) || typeof data !== "object") {
      return false;
    }
    const model = data as BedViewModel;
    return (
      typeof model.bedId === "number" &&
      typeof model.accountId === "number" &&
      typeof model.itemId === "number" &&
      typeof model.name === "string" &&
      typeof model.description === "string" &&
      (model.bedType === null || Object.values(BedType).includes(model.bedType))
    );
  }

  private static areValidModels(data: unknown[]): data is BedViewModel[] {
    if (!Array.isArray(data)) {
      return false;
    }
    return data.every((item: unknown): boolean => this.isValidModel(item));
  }
}
