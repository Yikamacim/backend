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
    _: ExpressRequest,
    res: MiddlewareResponse,
    next: ExpressNextFunction,
  ): MiddlewareResponse | void {
    try {
      LogHelper.failure(`(Server) ${error.name}`, error.message);
      return ResponseUtil.middlewareResponse(
        res,
        new HttpStatus(HttpStatusCode.INTERNAL_SERVER_ERROR),
        new ServerError(error),
        [],
      );
    } catch (error) {
      return next(error);
    }
  }
}
