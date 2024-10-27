import type { MiddlewareResponse } from "../../@types/responses";
import type { ExpressNextFunction, ExpressRequest } from "../../@types/wrappers";
import { Method } from "../enums/Method";
import { RouteHelper } from "../helpers/RouteHelper";
import type { IMiddleware } from "../interfaces/IMiddleware";
import { ClientError, ClientErrorCode } from "../schemas/ClientError";
import { HttpStatus, HttpStatusCode } from "../schemas/HttpStatus";
import { UnexpectedMethodError } from "../schemas/ServerError";
import { ResponseUtil } from "../utils/ResponseUtil";

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
