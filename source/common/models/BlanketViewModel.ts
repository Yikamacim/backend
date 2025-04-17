import type { IModel } from "../../app/interfaces/IModel";
import { ModelMismatchError } from "../../app/schemas/ServerError";
import { ProtoUtil } from "../../app/utils/ProtoUtil";
import { BlanketMaterial } from "../enums/BlanketMaterial";
import { BlanketSize } from "../enums/BlanketSize";

export class BlanketViewModel implements IModel {
  private constructor(
    public readonly blanketId: number,
    public readonly accountId: number,
    public readonly itemId: number,
    public readonly name: string,
    public readonly description: string,
    public readonly blanketSize: BlanketSize | null,
    public readonly blanketMaterial: BlanketMaterial | null,
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
    );
  }

  public static fromRecords(records: unknown[]): BlanketViewModel[] {
    if (!this.areValidModels(records)) {
      throw new ModelMismatchError(records);
    }
    return records.map((record: unknown): BlanketViewModel => this.fromRecord(record));
  }

  private static isValidModel(data: unknown): data is BlanketViewModel {
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
      (model.blanketSize === null || Object.values(BlanketSize).includes(model.blanketSize)) &&
      (model.blanketMaterial === null ||
        Object.values(BlanketMaterial).includes(model.blanketMaterial))
    );
  }

  private static areValidModels(data: unknown[]): data is BlanketViewModel[] {
    if (!Array.isArray(data)) {
      return false;
    }
    return data.every((item: unknown): boolean => this.isValidModel(item));
  }
}
