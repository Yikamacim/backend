import type { ControllerResponse } from "../../../../@types/responses";
import type { Tokens } from "../../../../@types/tokens";
import type { ExpressNextFunction, ExpressRequest } from "../../../../@types/wrappers";
import { PayloadHelper } from "../../../../app/helpers/PayloadHelper";
import type { IController } from "../../../../app/interfaces/IController";
import { HttpStatus, HttpStatusCode } from "../../../../app/schemas/HttpStatus";
import { ResponseUtil } from "../../../../app/utils/ResponseUtil";
import { AuthModule } from "../../../../modules/auth/module";
import { MyOrdersCompleteManager } from "./MyOrdersCompleteManager";
import { MyOrdersCompleteParams } from "./schemas/MyOrdersCompleteParams";
import { MyOrdersCompleteRequest } from "./schemas/MyOrdersCompleteRequest";
import type { MyOrdersCompleteResponse } from "./schemas/MyOrdersCompleteResponse";

export class MyOrdersCompleteController implements IController {
  public constructor(private readonly manager = new MyOrdersCompleteManager()) {}

  public async putMyOrdersComplete(
    req: ExpressRequest,
    res: ControllerResponse<MyOrdersCompleteResponse | null, Tokens | null>,
    next: ExpressNextFunction,
  ): Promise<typeof res | void> {
    try {
      // >-----------< AUTHORIZATION >-----------<
      const payload = PayloadHelper.getPayload(res);
      // >----------< VALIDATION >----------<
      const params = MyOrdersCompleteParams.parse(req);
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
      const request = MyOrdersCompleteRequest.parse(req);
      if (request.clientErrors.length > 0 || request.data === null) {
        return ResponseUtil.controllerResponse(
          res,
          new HttpStatus(HttpStatusCode.BAD_REQUEST),
          null,
          request.clientErrors,
          null,
          null,
        );
      }
      // >----------< LOGIC >----------<
      const out = await this.manager.putMyOrdersComplete(payload, params.data, request.data);
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
