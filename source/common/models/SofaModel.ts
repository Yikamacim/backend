import type { IModel } from "../../app/interfaces/IModel";
import { ModelMismatchError } from "../../app/schemas/ServerError";
import { ProtoUtil } from "../../app/utils/ProtoUtil";
import { ESofaMaterial } from "../enums/ESofaMaterial";
import { ESofaType } from "../enums/ESofaType";

export class SofaModel implements IModel {
  protected constructor(
    public readonly sofaId: number,
    public readonly itemId: number,
    public readonly isCushioned: boolean | null,
    public readonly sofaType: ESofaType | null,
    public readonly sofaMaterial: ESofaMaterial | null,
  ) {}

  public static fromRecord(record: unknown): SofaModel {
    if (!this.isValidModel(record)) {
      throw new ModelMismatchError(record);
    }
    return new SofaModel(
      record.sofaId,
      record.itemId,
      record.isCushioned,
      record.sofaType,
      record.sofaMaterial,
    );
  }

  public static fromRecords(records: unknown[]): SofaModel[] {
    if (!this.areValidModels(records)) {
      throw new ModelMismatchError(records);
    }
    return records.map((record: unknown): SofaModel => this.fromRecord(record));
  }

  protected static isValidModel(data: unknown): data is SofaModel {
    if (!ProtoUtil.isProtovalid(data) || typeof data !== "object") {
      return false;
    }
    const model = data as SofaModel;
    return (
      typeof model.sofaId === "number" &&
      typeof model.itemId === "number" &&
      (model.isCushioned === null || typeof model.isCushioned === "boolean") &&
      (model.sofaType === null || Object.values(ESofaType).includes(model.sofaType)) &&
      (model.sofaMaterial === null || Object.values(ESofaMaterial).includes(model.sofaMaterial))
    );
  }

  protected static areValidModels(data: unknown[]): data is SofaModel[] {
    if (!Array.isArray(data)) {
      return false;
    }
    return data.every((item: unknown) => this.isValidModel(item));
  }
}
