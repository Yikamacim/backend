import type { IModel } from "../app/interfaces/IModel.ts";
import type { IResponse } from "../app/interfaces/IResponse.ts";
import type { ClientError } from "../app/schemas/ClientError.ts";
import type { HttpStatus } from "../app/schemas/HttpStatus.ts";
import type { ServerError } from "../app/schemas/ServerError.ts";
import type { Tokens } from "./tokens.d.ts";
import type { ExpressResponse } from "./wrappers.d.ts";

export type ControllerResponse<
  D extends IResponse | null,
  T extends Tokens | null,
> = ExpressResponse<{
  httpStatus: HttpStatus;
  serverError: ServerError | null;
  clientErrors: ClientError[];
  data: D;
  tokens: T;
}>;

export type MiddlewareResponse = ControllerResponse<null, null>;

export type ManagerResponse<D extends IResponse | null> = {
  httpStatus: HttpStatus;
  serverError: ServerError | null;
  clientErrors: ClientError[];
  data: D;
};

export type ProviderResponse<D extends IModel | boolean | null> = {
  data: D;
};
