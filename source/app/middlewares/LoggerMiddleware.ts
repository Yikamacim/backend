import type { MiddlewareResponse } from "../../@types/responses";
import type { ExpressNextFunction, ExpressRequest } from "../../@types/wrappers";
import { RecordsBuilder } from "../../core/_internal/records/RecordsBuilder";
import { ConfigConstants } from "../constants/ConfigConstants";
import { LogHelper } from "../helpers/LogHelper";
import type { IMiddleware } from "../interfaces/IMiddleware";

export class LoggerMiddleware implements IMiddleware {
  public static log(req: ExpressRequest, _: MiddlewareResponse, next: ExpressNextFunction): void {
    try {
      if (req.url !== `${ConfigConstants.API_PREFIX}/${RecordsBuilder.BASE_ROUTE}`) {
        LogHelper.info(`Received a '${req.method}' request on url '${req.url}'.`);
        LogHelper.log("Request headers were:");
        LogHelper.detail(JSON.stringify(req.headers, null, 2), 1);
        LogHelper.log("Request body was:");
        LogHelper.detail(JSON.stringify(req.body, null, 2), 1);
        LogHelper.log("Request query was:");
        LogHelper.detail(JSON.stringify(req.query), 1);
      }
      return next();
    } catch (error) {
      return next(error);
    }
  }
}
