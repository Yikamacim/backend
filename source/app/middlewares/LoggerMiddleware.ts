import type { MiddlewareResponse } from "../../@types/responses.d.ts";
import type { ExpressNextFunction, ExpressRequest } from "../../@types/wrappers.d.ts";
import { ConsoleHelper } from "../helpers/ConsoleHelper.ts";
import type { IMiddleware } from "../interfaces/IMiddleware.ts";

export class LoggerMiddleware implements IMiddleware {
  public static log(
    req: ExpressRequest,
    _res: MiddlewareResponse,
    next: ExpressNextFunction,
  ): void {
    ConsoleHelper.log(`Received a "${req.method}" request on url "${req.url}".`);
    ConsoleHelper.log("Request headers were:");
    ConsoleHelper.detail(JSON.stringify(req.headers), 1);
    ConsoleHelper.log("Request body was:");
    ConsoleHelper.detail(JSON.stringify(req.body), 1);
    ConsoleHelper.log("Request query was:");
    ConsoleHelper.detail(JSON.stringify(req.query), 1);
    return next();
  }
}
