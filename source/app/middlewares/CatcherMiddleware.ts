import type { MiddlewareResponse } from "../../@types/responses.d.ts";
import type { ExpressNextFunction, ExpressRequest } from "../../@types/wrappers.d.ts";
import type { IMiddleware } from "../interfaces/IMiddleware.ts";
import { ClientError, ClientErrorCode } from "../schemas/ClientError.ts";
import { HttpStatus, HttpStatusCode } from "../schemas/HttpStatus.ts";
import { ResponseUtil } from "../utils/ResponseUtil.ts";

export class CatcherMiddleware implements IMiddleware {
  public static resourceNotFound(
    _req: ExpressRequest,
    res: MiddlewareResponse,
    _next: ExpressNextFunction,
  ): MiddlewareResponse | void {
    return ResponseUtil.middlewareResponse(res, new HttpStatus(HttpStatusCode.NOT_FOUND), null, [
      new ClientError(ClientErrorCode.RESOURCE_NOT_FOUND),
    ]);
  }
}
