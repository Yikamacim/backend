import type { IResponse } from "../interfaces/IResponse.ts";

export class ServerError implements IResponse {
  public readonly name: string;
  public readonly message: string;
  public readonly stackTrace: string | null;

  constructor(e: Error) {
    this.name = e.name;
    this.message = e.message;
    this.stackTrace = e.stack || null;
  }
}

export class UnexpectedQueryResultError extends Error {
  constructor() {
    super("Query result was unexpected. Contact with the developers.");
    this.name = "UnexpectedQueryResultError";
  }
}

export class ModelMismatchError extends Error {
  constructor(public readonly model: unknown) {
    super(
      `Server and database are not agreeing on model. The model was: \n${
        JSON.stringify(model, null, 2)
      }`,
    );
    this.name = "ModelMismatchError";
  }
}

export class UnexpectedMethodError extends Error {
  constructor(public readonly method: string) {
    super(`Method "${method}" is not expected. Contact with the developers.`);
    this.name = "UnexpectedMethodError";
  }
}
