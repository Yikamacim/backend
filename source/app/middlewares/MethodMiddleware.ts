import type { MiddlewareResponse } from "../../@types/responses.d.ts";
import type { ExpressNextFunction, ExpressRequest } from "../../@types/wrappers.d.ts";
import { Method } from "../enums/Method.ts";
import { RouteHelper } from "../helpers/RouteHelper.ts";
import type { IMiddleware } from "../interfaces/IMiddleware.ts";
import { ClientError, ClientErrorCode } from "../schemas/ClientError.ts";
import { HttpStatus, HttpStatusCode } from "../schemas/HttpStatus.ts";
import { UnexpectedMethodError } from "../schemas/ServerError.ts";
import { ResponseUtil } from "../utils/ResponseUtil.ts";

export class MethodMiddleware implements IMiddleware {
  public static methodNotAllowed(
    req: ExpressRequest,
    res: MiddlewareResponse,
    next: ExpressNextFunction,
  ): MiddlewareResponse | void {
    const routeMethods: Method[] | null = RouteHelper.getMethods(req.originalUrl);
    if (!routeMethods) {
      return next();
    }
    if (!Object.values(Method).includes(req.method.toUpperCase() as Method)) {
      throw new UnexpectedMethodError(req.method);
    }
    if (!routeMethods.includes(req.method as Method)) {
      return ResponseUtil.middlewareResponse(
        res,
        new HttpStatus(HttpStatusCode.METHOD_NOT_ALLOWED),
        null,
        [new ClientError(ClientErrorCode.METHOD_NOT_ALLOWED)],
      );
    } else {
      return next();
    }
  }
}
