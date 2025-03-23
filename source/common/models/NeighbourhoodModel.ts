import type { IModel } from "../../app/interfaces/IModel";
import { ModelMismatchError, UnexpectedQueryResultError } from "../../app/schemas/ServerError";

export class NeighbourhoodModel implements IModel {
  private constructor(
    public readonly neighbourhoodId: number,
    public readonly districtId: number,
    public readonly name: string,
    public readonly postalCode: string,
  ) {}

  public static fromRecord(record: unknown): NeighbourhoodModel {
    if (!record) {
      throw new UnexpectedQueryResultError();
    }
    if (!this.isValidModel(record)) {
      throw new ModelMismatchError(record);
    }
    return new NeighbourhoodModel(
      record.neighbourhoodId,
      record.districtId,
      record.name,
      record.postalCode,
    );
  }

  public static fromRecords(records: unknown[]): NeighbourhoodModel[] {
    if (!this.areValidModels(records)) {
      throw new ModelMismatchError(records);
    }
    return records.map((record: unknown): NeighbourhoodModel => this.fromRecord(record));
  }

  private static isValidModel(data: unknown): data is NeighbourhoodModel {
    if (typeof data !== "object" || data === null) {
      return false;
    }
    const model = data as NeighbourhoodModel;
    return (
      typeof model.neighbourhoodId === "number" &&
      typeof model.districtId === "number" &&
      typeof model.name === "string" &&
      typeof model.postalCode === "string"
    );
  }

  private static areValidModels(data: unknown[]): data is NeighbourhoodModel[] {
    if (!Array.isArray(data)) {
      return false;
    }
    return data.every((item: unknown): boolean => this.isValidModel(item));
  }
}
