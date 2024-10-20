import type { HttpStatusCodeMap } from "../../@types/maps.d.ts";
import type { IResponse } from "../interfaces/IResponse.ts";

export class HttpStatus implements IResponse {
  public readonly code: number;
  public readonly message: string;

  constructor(httpStatusCode: HttpStatusCode) {
    this.code = httpStatusCode;
    this.message = httpStatusMessages[httpStatusCode];
  }

  public isSuccess(): boolean {
    return this.code.toString().startsWith("2");
  }
}

export enum HttpStatusCode {
  OK = 200,
  CREATED = 201,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  METHOD_NOT_ALLOWED = 405,
  CONFLICT = 409,
  INTERNAL_SERVER_ERROR = 500,
}

export const httpStatusMessages: HttpStatusCodeMap<string> = {
  [HttpStatusCode.OK]: "OK",
  [HttpStatusCode.CREATED]: "Created",
  [HttpStatusCode.NO_CONTENT]: "No Content",
  [HttpStatusCode.BAD_REQUEST]: "Bad Request",
  [HttpStatusCode.UNAUTHORIZED]: "Unauthorized",
  [HttpStatusCode.FORBIDDEN]: "Forbidden",
  [HttpStatusCode.NOT_FOUND]: "Not Found",
  [HttpStatusCode.METHOD_NOT_ALLOWED]: "Method Not Allowed",
  [HttpStatusCode.CONFLICT]: "Conflict",
  [HttpStatusCode.INTERNAL_SERVER_ERROR]: "Internal Server Error",
};
