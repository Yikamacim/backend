import type { ControllerResponse } from "../../../@types/responses";
import type { Tokens } from "../../../@types/tokens";
import type { ExpressNextFunction, ExpressRequest } from "../../../@types/wrappers";
import { PayloadHelper } from "../../../app/helpers/PayloadHelper";
import type { IController } from "../../../app/interfaces/IController";
import { HttpStatus, HttpStatusCode } from "../../../app/schemas/HttpStatus";
import { ResponseUtil } from "../../../app/utils/ResponseUtil";
import { AuthModule } from "../../../modules/auth/module";
import { MyAddressesManager } from "./MyAddressesManager";
import { MyAddressesParams } from "./schemas/MyAddressesParams";
import { MyAddressesRequest } from "./schemas/MyAddressesRequest";
import type { MyAddressesResponse } from "./schemas/MyAddressesResponse";

export class MyAddressesController implements IController {
  public constructor(private readonly manager = new MyAddressesManager()) {}

  public async getMyAddresses(
    _: ExpressRequest,
    res: ControllerResponse<MyAddressesResponse[], Tokens | null>,
    next: ExpressNextFunction,
  ): Promise<typeof res | void> {
    try {
      // >-----------< AUTHORIZATION >-----------<
      const tokenPayload = PayloadHelper.getPayload(res);
      // >----------< LOGIC >----------<
      const mr = await this.manager.getMyAddresses(tokenPayload.accountId);
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

  public async postMyAddresses(
    req: ExpressRequest,
    res: ControllerResponse<MyAddressesResponse | null, Tokens | null>,
    next: ExpressNextFunction,
  ): Promise<typeof res | void> {
    try {
      // >-----------< AUTHORIZATION >-----------<
      const tokenPayload = PayloadHelper.getPayload(res);
      // >----------< VALIDATION >----------<
      const pr = MyAddressesRequest.parse(req);
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
      const mr = await this.manager.postMyAddresses(tokenPayload.accountId, pr.validatedData);
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

  public async getMyAddresses$addressId(
    req: ExpressRequest,
    res: ControllerResponse<MyAddressesResponse | null, Tokens | null>,
    next: ExpressNextFunction,
  ): Promise<typeof res | void> {
    try {
      // >-----------< AUTHORIZATION >-----------<
      const tokenPayload = PayloadHelper.getPayload(res);
      // >----------< VALIDATION >----------<
      const pp = MyAddressesParams.parse(req);
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
      const mr = await this.manager.getMyAddresses$addressId(
        tokenPayload.accountId,
        parseInt(pp.validatedData.addressId),
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

  public async putMyAddresses$addressId(
    req: ExpressRequest,
    res: ControllerResponse<MyAddressesResponse | null, Tokens | null>,
    next: ExpressNextFunction,
  ): Promise<typeof res | void> {
    try {
      // >-----------< AUTHORIZATION >-----------<
      const tokenPayload = PayloadHelper.getPayload(res);
      // >----------< VALIDATION >----------<
      const prParams = MyAddressesParams.parse(req);
      if (prParams.clientErrors.length > 0 || prParams.validatedData === null) {
        return ResponseUtil.controllerResponse(
          res,
          new HttpStatus(HttpStatusCode.BAD_REQUEST),
          null,
          prParams.clientErrors,
          null,
          null,
        );
      }
      const prBody = MyAddressesRequest.parse(req);
      if (prBody.clientErrors.length > 0 || prBody.validatedData === null) {
        return ResponseUtil.controllerResponse(
          res,
          new HttpStatus(HttpStatusCode.BAD_REQUEST),
          null,
          prBody.clientErrors,
          null,
          null,
        );
      }
      // >----------< LOGIC >----------<
      const mr = await this.manager.putMyAddresses$addressId(
        tokenPayload.accountId,
        parseInt(prParams.validatedData.addressId),
        prBody.validatedData,
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

  public async deleteMyAddresses$addressId(
    req: ExpressRequest,
    res: ControllerResponse<null, Tokens | null>,
    next: ExpressNextFunction,
  ): Promise<typeof res | void> {
    try {
      // >-----------< AUTHORIZATION >-----------<
      const tokenPayload = PayloadHelper.getPayload(res);
      // >----------< REQUEST VALIDATION >----------<
      const pr = MyAddressesParams.parse(req);
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
      const mr = await this.manager.deleteMyAddresses$addressId(
        tokenPayload.accountId,
        parseInt(pr.validatedData.addressId),
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
