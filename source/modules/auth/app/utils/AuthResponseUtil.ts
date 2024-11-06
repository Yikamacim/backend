import { DbConstants } from "../../../../app/constants/DbConstants";
import type { IModel } from "../../../../app/interfaces/IModel";
import type { IUtil } from "../../../../app/interfaces/IUtil";
import type { HandlerResponse } from "../../@types/responses";

export class AuthResponseUtil implements IUtil {
  public static async handlerResponse<D extends IModel | boolean | null>(
    data: D,
  ): Promise<HandlerResponse<D>> {
    await DbConstants.POOL.query(DbConstants.COMMIT);
    return {
      data,
    };
  }
}
