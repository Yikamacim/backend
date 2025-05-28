import type { ControllerResponse } from "../../../../../@types/responses";
import type { Tokens } from "../../../../../@types/tokens";
import type { ExpressNextFunction, ExpressRequest } from "../../../../../@types/wrappers";
import { PayloadHelper } from "../../../../../app/helpers/PayloadHelper";
import type { IController } from "../../../../../app/interfaces/IController";
import { HttpStatus, HttpStatusCode } from "../../../../../app/schemas/HttpStatus";
import { ResponseUtil } from "../../../../../app/utils/ResponseUtil";
import { AuthModule } from "../../../../../modules/auth/module";
import { MyBusinessOrdersCancelManager } from "./MyBusinessOrdersCancelManager";
import { MyBusinessOrdersCancelParams } from "./schemas/MyBusinessOrdersCancelParams";
import type { MyBusinessOrdersCancelResponse } from "./schemas/MyBusinessOrdersCancelResponse";

export class MyBusinessOrdersCancelController implements IController {
  public constructor(private readonly manager = new MyBusinessOrdersCancelManager()) {}

  public async putMyBusinessOrdersCancel(
    req: ExpressRequest,
    res: ControllerResponse<MyBusinessOrdersCancelResponse | null, Tokens | null>,
    next: ExpressNextFunction,
  ): Promise<typeof res | void> {
    try {
      // >-----------< AUTHORIZATION >-----------<
      const payload = PayloadHelper.getPayload(res);
      // >----------< VALIDATION >----------<
      const params = MyBusinessOrdersCancelParams.parse(req);
      if (params.clientErrors.length > 0 || params.data === null) {
        return ResponseUtil.controllerResponse(
          res,
          new HttpStatus(HttpStatusCode.BAD_REQUEST),
          null,
          params.clientErrors,
          null,
          null,
        );
      }
      // >----------< LOGIC >----------<
      const out = await this.manager.putMyBusinessOrdersCancel(payload, params.data);
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
