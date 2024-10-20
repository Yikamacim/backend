import { DbConstants } from "../../../../app/constants/DbConstants.ts";
import type { IModel } from "../../../../app/interfaces/IModel.ts";
import type { IUtil } from "../../../../app/interfaces/IUtil.ts";
import type { HandlerResponse } from "../../@types/responses.d.ts";

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
