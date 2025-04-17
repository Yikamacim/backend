import type { IModel } from "../../app/interfaces/IModel";
import { ModelMismatchError } from "../../app/schemas/ServerError";
import { ProtoUtil } from "../../app/utils/ProtoUtil";
import { SofaType } from "../enums/SofaType";

export class SofaModel implements IModel {
  private constructor(
    public readonly sofaId: number,
    public readonly itemId: number,
    public readonly sofaType: SofaType | null,
  ) {}

  public static fromRecord(record: unknown): SofaModel {
    if (!this.isValidModel(record)) {
      throw new ModelMismatchError(record);
    }
    return new SofaModel(record.sofaId, record.itemId, record.sofaType);
  }

  public static fromRecords(records: unknown[]): SofaModel[] {
    if (!this.areValidModels(records)) {
      throw new ModelMismatchError(records);
    }
    return records.map((record: unknown): SofaModel => this.fromRecord(record));
  }

  private static isValidModel(data: unknown): data is SofaModel {
    if (!ProtoUtil.isProtovalid(data) || typeof data !== "object") {
      return false;
    }
    const model = data as SofaModel;
    return (
      typeof model.sofaId === "number" &&
      typeof model.itemId === "number" &&
      (model.sofaType === null || Object.values(SofaType).includes(model.sofaType))
    );
  }

  private static areValidModels(data: unknown[]): data is SofaModel[] {
    if (!Array.isArray(data)) {
      return false;
    }
    return data.every((item: unknown): boolean => this.isValidModel(item));
  }
}
