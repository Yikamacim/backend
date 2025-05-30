import type { IModel } from "../../app/interfaces/IModel";
import { ModelMismatchError } from "../../app/schemas/ServerError";
import { ProtoUtil } from "../../app/utils/ProtoUtil";
import { EBlanketMaterial } from "../enums/EBlanketMaterial";
import { EBlanketSize } from "../enums/EBlanketSize";

export class BlanketModel implements IModel {
  protected constructor(
    public readonly blanketId: number,
    public readonly itemId: number,
    public readonly blanketSize: EBlanketSize | null,
    public readonly blanketMaterial: EBlanketMaterial | null,
  ) {}

  public static fromRecord(record: unknown): BlanketModel {
    if (!this.isValidModel(record)) {
      throw new ModelMismatchError(record);
    }
    return new BlanketModel(
      record.blanketId,
      record.itemId,
      record.blanketSize,
      record.blanketMaterial,
    );
  }

  public static fromRecords(records: unknown[]): BlanketModel[] {
    if (!this.areValidModels(records)) {
      throw new ModelMismatchError(records);
    }
    return records.map((record: unknown): BlanketModel => this.fromRecord(record));
  }

  protected static isValidModel(data: unknown): data is BlanketModel {
    if (!ProtoUtil.isProtovalid(data) || typeof data !== "object") {
      return false;
    }
    const model = data as BlanketModel;
    return (
      typeof model.blanketId === "number" &&
      typeof model.itemId === "number" &&
      (model.blanketSize === null || Object.values(EBlanketSize).includes(model.blanketSize)) &&
      (model.blanketMaterial === null ||
        Object.values(EBlanketMaterial).includes(model.blanketMaterial))
    );
  }

  protected static areValidModels(data: unknown[]): data is BlanketModel[] {
    if (!Array.isArray(data)) {
      return false;
    }
    return data.every((item: unknown) => this.isValidModel(item));
  }
}
