import type { ControllerResponse } from "../../../../../@types/responses";
import type { Tokens } from "../../../../../@types/tokens";
import type { ExpressNextFunction, ExpressRequest } from "../../../../../@types/wrappers";
import { PayloadHelper } from "../../../../../app/helpers/PayloadHelper";
import type { IController } from "../../../../../app/interfaces/IController";
import { HttpStatus, HttpStatusCode } from "../../../../../app/schemas/HttpStatus";
import { ResponseUtil } from "../../../../../app/utils/ResponseUtil";
import { AuthModule } from "../../../../../modules/auth/module";
import { MyBusinessOrdersManager } from "./MyBusinessOrdersManager";
import { MyBusinessOrdersParams } from "./schemas/MyBusinessOrdersParams";
import type { MyBusinessOrdersResponse } from "./schemas/MyBusinessOrdersResponse";

export class MyBusinessOrdersController implements IController {
  public constructor(private readonly manager = new MyBusinessOrdersManager()) {}

  public async getMyBusinessOrders(
    _: ExpressRequest,
    res: ControllerResponse<MyBusinessOrdersResponse[] | null, Tokens | null>,
    next: ExpressNextFunction,
  ): Promise<typeof res | void> {
    try {
      // >-----------< AUTHORIZATION >-----------<
      const payload = PayloadHelper.getPayload(res);
      // >----------< LOGIC >----------<
      const out = await this.manager.getMyBusinessOrders(payload);
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

  public async getMyBusinessOrders$(
    req: ExpressRequest,
    res: ControllerResponse<MyBusinessOrdersResponse | null, Tokens | null>,
    next: ExpressNextFunction,
  ): Promise<typeof res | void> {
    try {
      // >-----------< AUTHORIZATION >-----------<
      const payload = PayloadHelper.getPayload(res);
      // >----------< VALIDATION >----------<
      const params = MyBusinessOrdersParams.parse(req);
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
      const out = await this.manager.getMyBusinessOrders$(payload, params.data);
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
