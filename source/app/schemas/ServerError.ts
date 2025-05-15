import type { MediaType } from "../../common/enums/MediaType";
import type { IResponse } from "../interfaces/IResponse";

export class ServerError implements IResponse {
  public readonly name: string;
  public readonly message: string;
  public readonly stackTrace: string | null;

  public constructor(e: Error) {
    this.name = e.name;
    this.message = e.message;
    this.stackTrace = e.stack || null;
  }
}

export class UnexpectedDatabaseStateError extends Error {
  public constructor(public readonly state: string) {
    super(`Database state was unexpected. State: ${state}.`);
    this.name = "UnexpectedDatabaseStateError";
  }
}

export class ModelMismatchError extends Error {
  public constructor(public readonly model: unknown) {
    super(
      `Server and database are not agreeing on model. The model was: \n${JSON.stringify(
        model,
        null,
        2,
      )}`,
    );
    this.name = "ModelMismatchError";
  }
}

export class UnexpectedMethodError extends Error {
  public constructor(public readonly method: string) {
    super(`Method "${method}" is not expected. Contact with the developers.`);
    this.name = "UnexpectedMethodError";
  }
}

export class UnexpectedAuthError extends Error {
  public constructor() {
    super("Authentication failed unexpectedly. Contact with the developers.");
    this.name = "UnexpectedAuthError";
  }
}

export class UnexpectedVerificationError extends Error {
  public constructor() {
    super("Verification failed unexpectedly. Contact with the developers.");
    this.name = "UnexpectedVerificationError";
  }
}

export class CorruptedRouteInfoError extends Error {
  public constructor(public readonly route: string) {
    super(`Information about route "${route}" is corrupted. Contact with the developers.`);
    this.name = "CorruptedRouteInfoError";
  }
}

export class UnexpectedMediaTypeError extends Error {
  public constructor(public readonly mediaType: MediaType) {
    super(`Media type "${mediaType}" is not expected. Contact with the developers.`);
    this.name = "UnexpectedMediaTypeError";
  }
}

export class UnexpectedWeekdayError extends Error {
  public constructor(public readonly weekday: string) {
    super(`Weekday "${weekday}" is not expected. Contact with the developers.`);
    this.name = "UnexpectedWeekdayError";
  }
}
