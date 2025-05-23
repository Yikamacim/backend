import type { IModel } from "../app/interfaces/IModel";
import type { IParams } from "../app/interfaces/IParams";
import type { IQueries } from "../app/interfaces/IQueries";
import type { IRequest } from "../app/interfaces/IRequest";
import type { IResponse } from "../app/interfaces/IResponse";
import type { ClientError } from "../app/schemas/ClientError";
import type { HttpStatus } from "../app/schemas/HttpStatus";
import type { ServerError } from "../app/schemas/ServerError";
import type { Tokens } from "./tokens.d";
import type { ExpressResponse } from "./wrappers.d";

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

export type ParserResponse<T extends IRequest | IParams | IQueries | null> = {
  clientErrors: ClientError[];
  data: T;
};

export type MiddlewareResponse = ControllerResponse<null, null>;

export type ManagerResponse<D extends IResponse | null> = {
  httpStatus: HttpStatus;
  serverError: ServerError | null;
  clientErrors: ClientError[];
  data: D;
};

export type ProviderResponse<D extends IModel | boolean | null> = D;
