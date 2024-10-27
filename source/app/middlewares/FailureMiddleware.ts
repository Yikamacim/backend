import type { MiddlewareResponse } from "../../@types/responses.d.ts";
import type { ExpressNextFunction, ExpressRequest } from "../../@types/wrappers.d.ts";
import { LogHelper } from "../helpers/LogHelper.ts";
import type { IMiddleware } from "../interfaces/IMiddleware.ts";
import { HttpStatus, HttpStatusCode } from "../schemas/HttpStatus.ts";
import { ServerError } from "../schemas/ServerError.ts";
import { ResponseUtil } from "../utils/ResponseUtil.ts";

export class FailureMiddleware implements IMiddleware {
  public static serverFailure(
    error: Error,
    _req: ExpressRequest,
    res: MiddlewareResponse,
    _next: ExpressNextFunction,
  ): MiddlewareResponse | void {
    LogHelper.failure(`(Server) ${error.name}`, error.message);
    return ResponseUtil.middlewareResponse(
      res,
      new HttpStatus(HttpStatusCode.INTERNAL_SERVER_ERROR),
      new ServerError(error),
      [],
    );
  }
}
