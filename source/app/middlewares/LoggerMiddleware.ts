import type { MiddlewareResponse } from "../../@types/responses.d.ts";
import type { ExpressNextFunction, ExpressRequest } from "../../@types/wrappers.d.ts";
import type { IMiddleware } from "../interfaces/IMiddleware.ts";

export class LoggerMiddleware implements IMiddleware {
  public static log(
    req: ExpressRequest,
    _res: MiddlewareResponse,
    next: ExpressNextFunction,
  ): void {
    console.log(`Received a ${req.method} request on ${req.url} at ${new Date().toISOString()}`);
    return next();
  }
}
