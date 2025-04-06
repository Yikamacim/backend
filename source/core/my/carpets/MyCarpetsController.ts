import type { ControllerResponse } from "../../../@types/responses";
import type { Tokens } from "../../../@types/tokens";
import type { ExpressNextFunction, ExpressRequest } from "../../../@types/wrappers";
import { PayloadHelper } from "../../../app/helpers/PayloadHelper";
import type { IController } from "../../../app/interfaces/IController";
import { HttpStatus, HttpStatusCode } from "../../../app/schemas/HttpStatus";
import { ResponseUtil } from "../../../app/utils/ResponseUtil";
import { AuthModule } from "../../../modules/auth/module";
import { MyCarpetsManager } from "./MyCarpetsManager";
import { MyCarpetsParams } from "./schemas/MyCarpetsParams";
import { MyCarpetsRequest } from "./schemas/MyCarpetsRequest";
import type { MyCarpetsResponse } from "./schemas/MyCarpetsResponse";

export class MyCarpetsController implements IController {
  public constructor(private readonly manager = new MyCarpetsManager()) {}

  public async getMyCarpets(
    _: ExpressRequest,
    res: ControllerResponse<MyCarpetsResponse[], Tokens | null>,
    next: ExpressNextFunction,
  ): Promise<typeof res | void> {
    try {
      // >-----------< AUTHORIZATION >-----------<
      const tokenPayload = PayloadHelper.getPayload(res);
      // >----------< LOGIC >----------<
      const mr = await this.manager.getMyCarpets(tokenPayload.accountId);
      // >----------< RESPONSE >----------<
      if (!mr.httpStatus.isSuccess()) {
        return ResponseUtil.controllerResponse(
          res,
          mr.httpStatus,
          mr.serverError,
          mr.clientErrors,
          mr.data,
          null,
        );
      }
      return ResponseUtil.controllerResponse(
        res,
        mr.httpStatus,
        mr.serverError,
        mr.clientErrors,
        mr.data,
        await AuthModule.instance.refresh(tokenPayload),
      );
    } catch (error) {
      return next(error);
    }
  }

  public async postMyCarpets(
    req: ExpressRequest,
    res: ControllerResponse<MyCarpetsResponse | null, Tokens | null>,
    next: ExpressNextFunction,
  ): Promise<typeof res | void> {
    try {
      // >-----------< AUTHORIZATION >-----------<
      const tokenPayload = PayloadHelper.getPayload(res);
      // >----------< VALIDATION >----------<
      const pr = MyCarpetsRequest.parse(req);
      if (pr.clientErrors.length > 0 || pr.validatedData === null) {
        return ResponseUtil.controllerResponse(
          res,
          new HttpStatus(HttpStatusCode.BAD_REQUEST),
          null,
          pr.clientErrors,
          null,
          null,
        );
      }
      // >----------< LOGIC >----------<
      const mr = await this.manager.postMyCarpets(tokenPayload.accountId, pr.validatedData);
      // >----------< RESPONSE >----------<
      if (!mr.httpStatus.isSuccess()) {
        return ResponseUtil.controllerResponse(
          res,
          mr.httpStatus,
          mr.serverError,
          mr.clientErrors,
          mr.data,
          null,
        );
      }
      return ResponseUtil.controllerResponse(
        res,
        mr.httpStatus,
        mr.serverError,
        mr.clientErrors,
        mr.data,
        await AuthModule.instance.refresh(tokenPayload),
      );
    } catch (error) {
      return next(error);
    }
  }

  public async getMyCarpets$carpetId(
    req: ExpressRequest,
    res: ControllerResponse<MyCarpetsResponse | null, Tokens | null>,
    next: ExpressNextFunction,
  ): Promise<typeof res | void> {
    try {
      // >-----------< AUTHORIZATION >-----------<
      const tokenPayload = PayloadHelper.getPayload(res);
      // >----------< VALIDATION >----------<
      const pp = MyCarpetsParams.parse(req);
      if (pp.clientErrors.length > 0 || pp.validatedData === null) {
        return ResponseUtil.controllerResponse(
          res,
          new HttpStatus(HttpStatusCode.BAD_REQUEST),
          null,
          pp.clientErrors,
          null,
          null,
        );
      }
      // >----------< LOGIC >----------<
      const mr = await this.manager.getMyCarpets$carpetId(
        tokenPayload.accountId,
        parseInt(pp.validatedData.carpetId),
      );
      // >----------< RESPONSE >----------<
      if (!mr.httpStatus.isSuccess()) {
        return ResponseUtil.controllerResponse(
          res,
          mr.httpStatus,
          mr.serverError,
          mr.clientErrors,
          mr.data,
          null,
        );
      }
      return ResponseUtil.controllerResponse(
        res,
        mr.httpStatus,
        mr.serverError,
        mr.clientErrors,
        mr.data,
        await AuthModule.instance.refresh(tokenPayload),
      );
    } catch (error) {
      return next(error);
    }
  }

  public async putMyCarpets$carpetId(
    req: ExpressRequest,
    res: ControllerResponse<MyCarpetsResponse | null, Tokens | null>,
    next: ExpressNextFunction,
  ): Promise<typeof res | void> {
    try {
      // >-----------< AUTHORIZATION >-----------<
      const tokenPayload = PayloadHelper.getPayload(res);
      // >----------< VALIDATION >----------<
      const pp = MyCarpetsParams.parse(req);
      if (pp.clientErrors.length > 0 || pp.validatedData === null) {
        return ResponseUtil.controllerResponse(
          res,
          new HttpStatus(HttpStatusCode.BAD_REQUEST),
          null,
          pp.clientErrors,
          null,
          null,
        );
      }
      const pr = MyCarpetsRequest.parse(req);
      if (pr.clientErrors.length > 0 || pr.validatedData === null) {
        return ResponseUtil.controllerResponse(
          res,
          new HttpStatus(HttpStatusCode.BAD_REQUEST),
          null,
          pr.clientErrors,
          null,
          null,
        );
      }
      // >----------< LOGIC >----------<
      const mr = await this.manager.putMyCarpets$carpetId(
        tokenPayload.accountId,
        parseInt(pp.validatedData.carpetId),
        pr.validatedData,
      );
      // >----------< RESPONSE >----------<
      if (!mr.httpStatus.isSuccess()) {
        return ResponseUtil.controllerResponse(
          res,
          mr.httpStatus,
          mr.serverError,
          mr.clientErrors,
          mr.data,
          null,
        );
      }
      return ResponseUtil.controllerResponse(
        res,
        mr.httpStatus,
        mr.serverError,
        mr.clientErrors,
        mr.data,
        await AuthModule.instance.refresh(tokenPayload),
      );
    } catch (error) {
      return next(error);
    }
  }

  public async deleteMyCarpets$carpetId(
    req: ExpressRequest,
    res: ControllerResponse<MyCarpetsResponse | null, Tokens | null>,
    next: ExpressNextFunction,
  ): Promise<typeof res | void> {
    try {
      // >-----------< AUTHORIZATION >-----------<
      const tokenPayload = PayloadHelper.getPayload(res);
      // >----------< VALIDATION >----------<
      const pp = MyCarpetsParams.parse(req);
      if (pp.clientErrors.length > 0 || pp.validatedData === null) {
        return ResponseUtil.controllerResponse(
          res,
          new HttpStatus(HttpStatusCode.BAD_REQUEST),
          null,
          pp.clientErrors,
          null,
          null,
        );
      }
      // >----------< LOGIC >----------<
      const mr = await this.manager.deleteMyCarpets$carpetId(
        tokenPayload.accountId,
        parseInt(pp.validatedData.carpetId),
      );
      // >----------< RESPONSE >----------<
      if (!mr.httpStatus.isSuccess()) {
        return ResponseUtil.controllerResponse(
          res,
          mr.httpStatus,
          mr.serverError,
          mr.clientErrors,
          mr.data,
          null,
        );
      }
      return ResponseUtil.controllerResponse(
        res,
        mr.httpStatus,
        mr.serverError,
        mr.clientErrors,
        mr.data,
        await AuthModule.instance.refresh(tokenPayload),
      );
    } catch (error) {
      return next(error);
    }
  }
}
