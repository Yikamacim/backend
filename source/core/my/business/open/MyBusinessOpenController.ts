import type { ControllerResponse } from "../../../../@types/responses";
import type { Tokens } from "../../../../@types/tokens";
import type { ExpressNextFunction, ExpressRequest } from "../../../../@types/wrappers";
import { PayloadHelper } from "../../../../app/helpers/PayloadHelper";
import type { IController } from "../../../../app/interfaces/IController";
import { ResponseUtil } from "../../../../app/utils/ResponseUtil";
import { AuthModule } from "../../../../modules/auth/module";
import { MyBusinessOpenManager } from "./MyBusinessOpenManager";
import type { MyBusinessOpenResponse } from "./schemas/MyBusinessOpenResponse";

export class MyBusinessOpenController implements IController {
  public constructor(private readonly manager = new MyBusinessOpenManager()) {}

  public async putMyBusinessOpen(
    _: ExpressRequest,
    res: ControllerResponse<MyBusinessOpenResponse | null, Tokens | null>,
    next: ExpressNextFunction,
  ): Promise<typeof res | void> {
    try {
      // >-----------< AUTHORIZATION >-----------<
      const payload = PayloadHelper.getPayload(res);
      // >----------< LOGIC >----------<
      const out = await this.manager.putMyBusinessOpen(payload);
      // >----------< RESPONSE >----------<
      if (!out.httpStatus.isSuccess()) {
        return ResponseUtil.controllerResponse(
          res,
          out.httpStatus,
          out.serverError,
          out.clientErrors,
          out.data,
          null,
        );
      }
      return ResponseUtil.controllerResponse(
        res,
        out.httpStatus,
        out.serverError,
        out.clientErrors,
        out.data,
        await AuthModule.instance.refresh(payload),
      );
    } catch (error) {
      return next(error);
    }
  }
}
