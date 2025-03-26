import type { IModel } from "../../app/interfaces/IModel";
import { ModelMismatchError, UnexpectedQueryResultError } from "../../app/schemas/ServerError";

export class NeighborhoodModel implements IModel {
  private constructor(
    public readonly neighborhoodId: number,
    public readonly districtId: number,
    public readonly name: string,
    public readonly postalCode: string,
  ) {}

  public static fromRecord(record: unknown): NeighborhoodModel {
    if (!record) {
      throw new UnexpectedQueryResultError();
    }
    if (!this.isValidModel(record)) {
      throw new ModelMismatchError(record);
    }
    return new NeighborhoodModel(
      record.neighborhoodId,
      record.districtId,
      record.name,
      record.postalCode,
    );
  }

  public static fromRecords(records: unknown[]): NeighborhoodModel[] {
    if (!this.areValidModels(records)) {
      throw new ModelMismatchError(records);
    }
    return records.map((record: unknown): NeighborhoodModel => this.fromRecord(record));
  }

  private static isValidModel(data: unknown): data is NeighborhoodModel {
    if (typeof data !== "object" || data === null) {
      return false;
    }
    const model = data as NeighborhoodModel;
    return (
      typeof model.neighborhoodId === "number" &&
      typeof model.districtId === "number" &&
      typeof model.name === "string" &&
      typeof model.postalCode === "string"
    );
  }

  private static areValidModels(data: unknown[]): data is NeighborhoodModel[] {
    if (!Array.isArray(data)) {
      return false;
    }
    return data.every((item: unknown): boolean => this.isValidModel(item));
  }
}
