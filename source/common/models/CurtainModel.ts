import type { IModel } from "../../app/interfaces/IModel";
import { ModelMismatchError } from "../../app/schemas/ServerError";
import { ProtoUtil } from "../../app/utils/ProtoUtil";
import { CurtainType } from "../enums/CurtainType";

export class CurtainModel implements IModel {
  private constructor(
    public readonly curtainId: number,
    public readonly itemId: number,
    public readonly width: number | null,
    public readonly length: number | null,
    public readonly curtainType: CurtainType | null,
  ) {}

  public static fromRecord(record: unknown): CurtainModel {
    if (!this.isValidModel(record)) {
      throw new ModelMismatchError(record);
    }
    return new CurtainModel(
      record.curtainId,
      record.itemId,
      record.width,
      record.length,
      record.curtainType,
    );
  }

  public static fromRecords(records: unknown[]): CurtainModel[] {
    if (!this.areValidModels(records)) {
      throw new ModelMismatchError(records);
    }
    return records.map((record: unknown): CurtainModel => this.fromRecord(record));
  }

  private static isValidModel(data: unknown): data is CurtainModel {
    if (!ProtoUtil.isProtovalid(data) || typeof data !== "object") {
      return false;
    }
    const model = data as CurtainModel;
    return (
      typeof model.curtainId === "number" &&
      typeof model.itemId === "number" &&
      (model.width === null || typeof model.width === "number") &&
      (model.length === null || typeof model.length === "number") &&
      (model.curtainType === null || Object.values(CurtainType).includes(model.curtainType))
    );
  }

  private static areValidModels(data: unknown[]): data is CurtainModel[] {
    if (!Array.isArray(data)) {
      return false;
    }
    return data.every((item: unknown): boolean => this.isValidModel(item));
  }
}
