import type { ControllerResponse } from "../../../../@types/responses";
import type { Tokens } from "../../../../@types/tokens";
import type { ExpressNextFunction, ExpressRequest } from "../../../../@types/wrappers";
import { PayloadHelper } from "../../../../app/helpers/PayloadHelper";
import type { IController } from "../../../../app/interfaces/IController";
import { HttpStatus, HttpStatusCode } from "../../../../app/schemas/HttpStatus";
import { ResponseUtil } from "../../../../app/utils/ResponseUtil";
import { AuthModule } from "../../../../modules/auth/module";
import { MyBusinessAreasManager } from "./MyBusinessAreasManager";
import { MyBusinessAreasParams } from "./schemas/MyBusinessAreasParams";
import { MyBusinessAreasRequest } from "./schemas/MyBusinessAreasRequest";
import type { MyBusinessAreasResponse } from "./schemas/MyBusinessAreasResponse";

export class MyBusinessAreasController implements IController {
  public constructor(private readonly manager = new MyBusinessAreasManager()) {}

  public async getMyBusinessAreas(
    _: ExpressRequest,
    res: ControllerResponse<MyBusinessAreasResponse[] | null, Tokens | null>,
    next: ExpressNextFunction,
  ): Promise<typeof res | void> {
    try {
      // >-----------< AUTHORIZATION >-----------<
      const payload = PayloadHelper.getPayload(res);
      // >----------< LOGIC >----------<
      const out = await this.manager.getMyBusinessAreas(payload);
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

  public async postMyBusinessAreas(
    req: ExpressRequest,
    res: ControllerResponse<MyBusinessAreasResponse | null, Tokens | null>,
    next: ExpressNextFunction,
  ): Promise<typeof res | void> {
    try {
      // >-----------< AUTHORIZATION >-----------<
      const payload = PayloadHelper.getPayload(res);
      // >----------< VALIDATION >----------<
      const request = MyBusinessAreasRequest.parse(req);
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
      const out = await this.manager.postMyBusinessAreas(payload, request.data);
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

  public async deleteMyBusinessAreas$(
    req: ExpressRequest,
    res: ControllerResponse<null, Tokens | null>,
    next: ExpressNextFunction,
  ): Promise<typeof res | void> {
    try {
      // >-----------< AUTHORIZATION >-----------<
      const payload = PayloadHelper.getPayload(res);
      // >----------< VALIDATION >----------<
      const params = MyBusinessAreasParams.parse(req);
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
      const out = await this.manager.deleteMyBusinessAreas$(payload, params.data);
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
