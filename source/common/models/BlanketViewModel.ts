import type { IModel } from "../../app/interfaces/IModel";
import { ModelMismatchError } from "../../app/schemas/ServerError";
import { ProtoUtil } from "../../app/utils/ProtoUtil";
import { EBlanketMaterial } from "../enums/EBlanketMaterial";
import { EBlanketSize } from "../enums/EBlanketSize";

export class BlanketViewModel implements IModel {
  protected constructor(
    public readonly blanketId: number,
    public readonly accountId: number,
    public readonly itemId: number,
    public readonly name: string,
    public readonly description: string,
    public readonly blanketSize: EBlanketSize | null,
    public readonly blanketMaterial: EBlanketMaterial | null,
    public readonly isDeleted: boolean,
  ) {}

  public static fromRecord(record: unknown): BlanketViewModel {
    if (!this.isValidModel(record)) {
      throw new ModelMismatchError(record);
    }
    return new BlanketViewModel(
      record.blanketId,
      record.accountId,
      record.itemId,
      record.name,
      record.description,
      record.blanketSize,
      record.blanketMaterial,
      record.isDeleted,
    );
  }

  public static fromRecords(records: unknown[]): BlanketViewModel[] {
    if (!this.areValidModels(records)) {
      throw new ModelMismatchError(records);
    }
    return records.map((record: unknown): BlanketViewModel => this.fromRecord(record));
  }

  protected static isValidModel(data: unknown): data is BlanketViewModel {
    if (!ProtoUtil.isProtovalid(data) || typeof data !== "object") {
      return false;
    }
    const model = data as BlanketViewModel;
    return (
      typeof model.blanketId === "number" &&
      typeof model.accountId === "number" &&
      typeof model.itemId === "number" &&
      typeof model.name === "string" &&
      typeof model.description === "string" &&
      (model.blanketSize === null || Object.values(EBlanketSize).includes(model.blanketSize)) &&
      (model.blanketMaterial === null ||
        Object.values(EBlanketMaterial).includes(model.blanketMaterial)) &&
      typeof model.isDeleted === "boolean"
    );
  }

  protected static areValidModels(data: unknown[]): data is BlanketViewModel[] {
    if (!Array.isArray(data)) {
      return false;
    }
    return data.every((item: unknown) => this.isValidModel(item));
  }
}
