import type { IModel } from "../../app/interfaces/IModel";
import { ModelMismatchError } from "../../app/schemas/ServerError";
import { ProtoUtil } from "../../app/utils/ProtoUtil";
import { SofaType } from "../enums/SofaType";

export class SofaViewModel implements IModel {
  private constructor(
    public readonly sofaId: number,
    public readonly accountId: number,
    public readonly itemId: number,
    public readonly name: string,
    public readonly description: string,
    public readonly sofaType: SofaType | null,
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
      record.sofaType,
    );
  }

  public static fromRecords(records: unknown[]): SofaViewModel[] {
    if (!this.areValidModels(records)) {
      throw new ModelMismatchError(records);
    }
    return records.map((record: unknown): SofaViewModel => this.fromRecord(record));
  }

  private static isValidModel(data: unknown): data is SofaViewModel {
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
      (model.sofaType === null || Object.values(SofaType).includes(model.sofaType))
    );
  }

  private static areValidModels(data: unknown[]): data is SofaViewModel[] {
    if (!Array.isArray(data)) {
      return false;
    }
    return data.every((item: unknown): boolean => this.isValidModel(item));
  }
}
