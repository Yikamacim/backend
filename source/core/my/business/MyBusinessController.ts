import type { ControllerResponse } from "../../../@types/responses";
import type { Tokens } from "../../../@types/tokens";
import type { ExpressNextFunction, ExpressRequest } from "../../../@types/wrappers";
import { PayloadHelper } from "../../../app/helpers/PayloadHelper";
import type { IController } from "../../../app/interfaces/IController";
import { HttpStatus, HttpStatusCode } from "../../../app/schemas/HttpStatus";
import { ResponseUtil } from "../../../app/utils/ResponseUtil";
import { AuthModule } from "../../../modules/auth/module";
import { MyBusinessManager } from "./MyBusinessManager";
import { MyBusinessRequest } from "./schemas/MyBusinessRequest";
import type { MyBusinessResponse } from "./schemas/MyBusinessResponse";

export class MyBusinessController implements IController {
  public constructor(private readonly manager = new MyBusinessManager()) {}

  public async getMyBusiness(
    _: ExpressRequest,
    res: ControllerResponse<MyBusinessResponse | null, Tokens | null>,
    next: ExpressNextFunction,
  ): Promise<typeof res | void> {
    try {
      // >-----------< AUTHORIZATION >-----------<
      const payload = PayloadHelper.getPayload(res);
      // >----------< LOGIC >----------<
      const out = await this.manager.getMyBusiness(payload);
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

  public async postMyBusiness(
    req: ExpressRequest,
    res: ControllerResponse<MyBusinessResponse | null, Tokens | null>,
    next: ExpressNextFunction,
  ): Promise<typeof res | void> {
    try {
      // >-----------< AUTHORIZATION >-----------<
      const payload = PayloadHelper.getPayload(res);
      // >----------< VALIDATION >----------<
      const request = MyBusinessRequest.parse(req);
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
      const out = await this.manager.postMyBusiness(payload, request.data);
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

  // public async putMyBusiness(
  //   req: ExpressRequest,
  //   res: ControllerResponse<MyBusinessResponse | null, Tokens | null>,
  //   next: ExpressNextFunction,
  // ): Promise<typeof res | void> {
  //   try {
  //     // >-----------< AUTHORIZATION >-----------<
  //     const payload = PayloadHelper.getPayload(res);
  //     // >----------< VALIDATION >----------<
  //     const request = MyBusinessRequest.parse(req);
  //     if (request.clientErrors.length > 0 || request.data === null) {
  //       return ResponseUtil.controllerResponse(
  //         res,
  //         new HttpStatus(HttpStatusCode.BAD_REQUEST),
  //         null,
  //         request.clientErrors,
  //         null,
  //         null,
  //       );
  //     }
  //     // >----------< LOGIC >----------<
  //     const out = await this.manager.putMyBusiness$(payload, params.data, request.data);
  //     // >----------< RESPONSE >----------<
  //     if (!out.httpStatus.isSuccess()) {
  //       return ResponseUtil.controllerResponse(
  //         res,
  //         out.httpStatus,
  //         out.serverError,
  //         out.clientErrors,
  //         out.data,
  //         null,
  //       );
  //     }
  //     return ResponseUtil.controllerResponse(
  //       res,
  //       out.httpStatus,
  //       out.serverError,
  //       out.clientErrors,
  //       out.data,
  //       await AuthModule.instance.refresh(payload),
  //     );
  //   } catch (error) {
  //     return next(error);
  //   }
  // }
}
