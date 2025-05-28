import type { ControllerResponse } from "../../../../../@types/responses";
import type { Tokens } from "../../../../../@types/tokens";
import type { ExpressNextFunction, ExpressRequest } from "../../../../../@types/wrappers";
import { PayloadHelper } from "../../../../../app/helpers/PayloadHelper";
import type { IController } from "../../../../../app/interfaces/IController";
import { HttpStatus, HttpStatusCode } from "../../../../../app/schemas/HttpStatus";
import { ResponseUtil } from "../../../../../app/utils/ResponseUtil";
import { AuthModule } from "../../../../../modules/auth/module";
import { MyBusinessOrdersMessagesManager } from "./MyBusinessOrdersMessagesManager";
import { MyBusinessOrdersMessagesParams } from "./schemas/MyBusinessOrdersMessagesParams";
import { MyBusinessOrdersMessagesRequest } from "./schemas/MyBusinessOrdersMessagesRequest";
import type { MyBusinessOrdersMessagesResponse } from "./schemas/MyBusinessOrdersMessagesResponse";

export class MyBusinessOrdersMessagesController implements IController {
  public constructor(private readonly manager = new MyBusinessOrdersMessagesManager()) {}

  public async getMyBusinessOrdersMessages(
    req: ExpressRequest,
    res: ControllerResponse<MyBusinessOrdersMessagesResponse[] | null, Tokens | null>,
    next: ExpressNextFunction,
  ): Promise<typeof res | void> {
    try {
      // >-----------< AUTHORIZATION >-----------<
      const payload = PayloadHelper.getPayload(res);
      // >----------< VALIDATION >----------<
      const params = MyBusinessOrdersMessagesParams.parse(req);
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
      const out = await this.manager.getMyBusinessOrdersMessages(payload, params.data);
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

  public async postMyBusinessOrdersMessages(
    req: ExpressRequest,
    res: ControllerResponse<MyBusinessOrdersMessagesResponse[] | null, Tokens | null>,
    next: ExpressNextFunction,
  ): Promise<typeof res | void> {
    try {
      // >-----------< AUTHORIZATION >-----------<
      const payload = PayloadHelper.getPayload(res);
      // >----------< VALIDATION >----------<
      const params = MyBusinessOrdersMessagesParams.parse(req);
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
      const request = MyBusinessOrdersMessagesRequest.parse(req);
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
      const out = await this.manager.postMyBusinessOrdersMessages(
        payload,
        params.data,
        request.data,
      );
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
