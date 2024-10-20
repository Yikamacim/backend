import type { ClientErrorCode } from "../app/schemas/ClientError.ts";
import type { HttpStatusCode } from "../app/schemas/HttpStatus.ts";

export type HttpStatusCodeMap<T> = {
  [key in HttpStatusCode]: T;
};

export type ClientErrorCodeMap<T> = {
  [key in ClientErrorCode]: T;
};
