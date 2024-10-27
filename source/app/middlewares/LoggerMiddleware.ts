import type { MiddlewareResponse } from "../../@types/responses.d.ts";
import type { ExpressNextFunction, ExpressRequest } from "../../@types/wrappers.d.ts";
import { RecordsBuilder } from "../../core/records/RecordsBuilder.ts";
import { ConfigConstants } from "../constants/ConfigConstants.ts";
import { LogHelper } from "../helpers/LogHelper.ts";
import type { IMiddleware } from "../interfaces/IMiddleware.ts";

export class LoggerMiddleware implements IMiddleware {
  public static log(
    req: ExpressRequest,
    _res: MiddlewareResponse,
    next: ExpressNextFunction,
  ): void {
    if (req.url !== `${ConfigConstants.API_PREFIX}/${RecordsBuilder.BASE_ROUTE}`) {
      LogHelper.info(`Received a "${req.method}" request on url "${req.url}".`);
      LogHelper.log("Request headers were:");
      LogHelper.detail(JSON.stringify(req.headers, null, 2), 1);
      LogHelper.log("Request body was:");
      LogHelper.detail(JSON.stringify(req.body, null, 2), 1);
      LogHelper.log("Request query was:");
      LogHelper.detail(JSON.stringify(req.query), 1);
    }
    return next();
  }
}
