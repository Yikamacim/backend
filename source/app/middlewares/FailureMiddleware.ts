import type { MiddlewareResponse } from "../../@types/responses";
import type { ExpressNextFunction, ExpressRequest } from "../../@types/wrappers";
import { LogHelper } from "../helpers/LogHelper";
import type { IMiddleware } from "../interfaces/IMiddleware";
import { HttpStatus, HttpStatusCode } from "../schemas/HttpStatus";
import { ServerError } from "../schemas/ServerError";
import { ResponseUtil } from "../utils/ResponseUtil";

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
