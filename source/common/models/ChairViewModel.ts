import type { IModel } from "../../app/interfaces/IModel";
import { ModelMismatchError } from "../../app/schemas/ServerError";
import { ProtoUtil } from "../../app/utils/ProtoUtil";

export class ChairViewModel implements IModel {
  private constructor(
    public readonly chairId: number,
    public readonly accountId: number,
    public readonly itemId: number,
    public readonly name: string,
    public readonly description: string,
    public readonly quantity: number,
  ) {}

  public static fromRecord(record: unknown): ChairViewModel {
    if (!this.isValidModel(record)) {
      throw new ModelMismatchError(record);
    }
    return new ChairViewModel(
      record.chairId,
      record.accountId,
      record.itemId,
      record.name,
      record.description,
      record.quantity,
    );
  }

  public static fromRecords(records: unknown[]): ChairViewModel[] {
    if (!this.areValidModels(records)) {
      throw new ModelMismatchError(records);
    }
    return records.map((record: unknown): ChairViewModel => this.fromRecord(record));
  }

  private static isValidModel(data: unknown): data is ChairViewModel {
    if (!ProtoUtil.isProtovalid(data) || typeof data !== "object") {
      return false;
    }
    const model = data as ChairViewModel;
    return (
      typeof model.chairId === "number" &&
      typeof model.accountId === "number" &&
      typeof model.itemId === "number" &&
      typeof model.name === "string" &&
      typeof model.description === "string" &&
      typeof model.quantity === "number"
    );
  }

  private static areValidModels(data: unknown[]): data is ChairViewModel[] {
    if (!Array.isArray(data)) {
      return false;
    }
    return data.every((item: unknown): boolean => this.isValidModel(item));
  }
}
