import type { ClientErrorCode } from "../app/schemas/ClientError";
import type { HttpStatusCode } from "../app/schemas/HttpStatus";

export type HttpStatusCodeMap<T> = {
  [key in HttpStatusCode]: T;
};

export type ClientErrorCodeMap<T> = {
  [key in ClientErrorCode]: T;
};
