import type { ExpressNextFunction, ExpressRequest, ExpressResponse } from "../../@types/wrappers";
import type { IHelper } from "../interfaces/IHelper";

export class AsyncHelper implements IHelper {
  public static sync<T>(
    req: ExpressRequest,
    res: ExpressResponse<T>,
    next: ExpressNextFunction,
    fn: (
      req: ExpressRequest,
      res: ExpressResponse<T>,
      next: ExpressNextFunction,
    ) => Promise<unknown>,
  ): void {
    fn(req, res, next).catch(next);
  }
}
