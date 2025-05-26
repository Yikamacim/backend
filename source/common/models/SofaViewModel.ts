import type { IModel } from "../../app/interfaces/IModel";
import { ModelMismatchError } from "../../app/schemas/ServerError";
import { ProtoUtil } from "../../app/utils/ProtoUtil";
import { ESofaMaterial } from "../enums/ESofaMaterial";
import { ESofaType } from "../enums/ESofaType";

export class SofaViewModel implements IModel {
  protected constructor(
    public readonly sofaId: number,
    public readonly accountId: number,
    public readonly itemId: number,
    public readonly name: string,
    public readonly description: string,
    public readonly isCushioned: boolean | null,
    public readonly sofaType: ESofaType | null,
    public readonly sofaMaterial: ESofaMaterial | null,
    public readonly isDeleted: boolean,
  ) {}

  public static fromRecord(record: unknown): SofaViewModel {
    if (!this.isValidModel(record)) {
      throw new ModelMismatchError(record);
    }
    return new SofaViewModel(
      record.sofaId,
      record.accountId,
      record.itemId,
      record.name,
      record.description,
      record.isCushioned,
      record.sofaType,
      record.sofaMaterial,
      record.isDeleted,
    );
  }

  public static fromRecords(records: unknown[]): SofaViewModel[] {
    if (!this.areValidModels(records)) {
      throw new ModelMismatchError(records);
    }
    return records.map((record: unknown): SofaViewModel => this.fromRecord(record));
  }

  protected static isValidModel(data: unknown): data is SofaViewModel {
    if (!ProtoUtil.isProtovalid(data) || typeof data !== "object") {
      return false;
    }
    const model = data as SofaViewModel;
    return (
      typeof model.sofaId === "number" &&
      typeof model.accountId === "number" &&
      typeof model.itemId === "number" &&
      typeof model.name === "string" &&
      typeof model.description === "string" &&
      (model.isCushioned === null || typeof model.isCushioned === "boolean") &&
      (model.sofaType === null || Object.values(ESofaType).includes(model.sofaType)) &&
      (model.sofaMaterial === null || Object.values(ESofaMaterial).includes(model.sofaMaterial)) &&
      typeof model.isDeleted === "boolean"
    );
  }

  protected static areValidModels(data: unknown[]): data is SofaViewModel[] {
    if (!Array.isArray(data)) {
      return false;
    }
    return data.every((item: unknown) => this.isValidModel(item));
  }
}
