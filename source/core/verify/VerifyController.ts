import type { ControllerResponse } from "../../@types/responses";
import type { Tokens } from "../../@types/tokens";
import type { ExpressNextFunction, ExpressRequest } from "../../@types/wrappers";
import type { IController } from "../../app/interfaces/IController";
import { ClientError, ClientErrorCode } from "../../app/schemas/ClientError";
import { HttpStatus, HttpStatusCode } from "../../app/schemas/HttpStatus";
import { ProtoUtil } from "../../app/utils/ProtoUtil";
import { ResponseUtil } from "../../app/utils/ResponseUtil";
import { AuthModule } from "../../modules/auth/module";
import { SmsModule } from "../../modules/sms/module";
import { VerifyManager } from "./VerifyManager";
import { VerifyParams } from "./schemas/VerifyParams";
import { VerifyRequest } from "./schemas/VerifyRequest";
import type { VerifyResponse } from "./schemas/VerifyResponse";

export class VerifyController implements IController {
  public constructor(private readonly manager = new VerifyManager()) {}

  public async getVerify$phone(
    req: ExpressRequest,
    res: ControllerResponse<null, null>,
    next: ExpressNextFunction,
  ): Promise<ControllerResponse<null, null> | void> {
    try {
      // >----------< REQUEST VALIDATION >----------<
      const preliminaryData: unknown = req.params["phone"];
      // V1: Existence validation
      if (!ProtoUtil.isProtovalid(preliminaryData)) {
        return ResponseUtil.controllerResponse(
          res,
          new HttpStatus(HttpStatusCode.BAD_REQUEST),
          null,
          [new ClientError(ClientErrorCode.MISSING_PARAMETER)],
          null,
          null,
        );
      }
      const protovalidData: unknown = { phone: preliminaryData };
      // V2: Schematic validation
      if (!VerifyParams.isBlueprint(protovalidData)) {
        return ResponseUtil.controllerResponse(
          res,
          new HttpStatus(HttpStatusCode.BAD_REQUEST),
          null,
          [new ClientError(ClientErrorCode.INVALID_PARAMETER)],
          null,
          null,
        );
      }
      const blueprintData: VerifyParams = protovalidData;
      // V3: Physical validation
      const validationErrors = VerifyParams.getValidationErrors(blueprintData);
      if (validationErrors.length > 0) {
        return ResponseUtil.controllerResponse(
          res,
          new HttpStatus(HttpStatusCode.BAD_REQUEST),
          null,
          validationErrors,
          null,
          null,
        );
      }
      const validatedData = blueprintData;
      // >----------< HAND OVER TO MANAGER >----------<
      const mrGetVerify$phone = await this.manager.getVerify$phone(validatedData);
      // Check manager response
      if (!mrGetVerify$phone.httpStatus.isSuccess()) {
        // Respond with error
        return ResponseUtil.controllerResponse(
          res,
          mrGetVerify$phone.httpStatus,
          mrGetVerify$phone.serverError,
          mrGetVerify$phone.clientErrors,
          mrGetVerify$phone.data,
          null,
        );
      }
      // Send SMS
      await SmsModule.instance.send(validatedData.phone);
      // Respond without token
      return ResponseUtil.controllerResponse(
        res,
        mrGetVerify$phone.httpStatus,
        mrGetVerify$phone.serverError,
        mrGetVerify$phone.clientErrors,
        mrGetVerify$phone.data,
        null,
      );
    } catch (error) {
      return next(error);
    }
  }

  public async postVerify(
    req: ExpressRequest,
    res: ControllerResponse<VerifyResponse | null, Tokens | null>,
    next: ExpressNextFunction,
  ): Promise<typeof res | void> {
    try {
      // >----------< REQUEST VALIDATION >----------<
      const preliminaryData: unknown = req.body;
      // V1: Existence validation
      if (!ProtoUtil.isProtovalid(preliminaryData)) {
        return ResponseUtil.controllerResponse(
          res,
          new HttpStatus(HttpStatusCode.BAD_REQUEST),
          null,
          [new ClientError(ClientErrorCode.MISSING_BODY)],
          null,
          null,
        );
      }
      const protovalidData: unknown = preliminaryData;
      // V2: Schematic validation
      if (!VerifyRequest.isBlueprint(protovalidData)) {
        return ResponseUtil.controllerResponse(
          res,
          new HttpStatus(HttpStatusCode.BAD_REQUEST),
          null,
          [new ClientError(ClientErrorCode.INVALID_BODY)],
          null,
          null,
        );
      }
      const blueprintData: VerifyRequest = protovalidData;
      // V3: Physical validation
      const validationErrors: ClientError[] = VerifyRequest.getValidationErrors(blueprintData);
      if (validationErrors.length > 0) {
        return ResponseUtil.controllerResponse(
          res,
          new HttpStatus(HttpStatusCode.BAD_REQUEST),
          null,
          validationErrors,
          null,
          null,
        );
      }
      const validatedData = blueprintData;
      // >-----------< HAND OVER TO MANAGER >-----------<
      const mrPostVerify = await this.manager.postVerify(validatedData);
      // Check manager response
      if (!mrPostVerify.httpStatus.isSuccess() || !mrPostVerify.data) {
        // Respond without token
        return ResponseUtil.controllerResponse(
          res,
          mrPostVerify.httpStatus,
          mrPostVerify.serverError,
          mrPostVerify.clientErrors,
          mrPostVerify.data,
          null,
        );
      }
      // Respond with token
      return ResponseUtil.controllerResponse(
        res,
        mrPostVerify.httpStatus,
        mrPostVerify.serverError,
        mrPostVerify.clientErrors,
        mrPostVerify.data,
        await AuthModule.instance.generate({
          accountId: mrPostVerify.data.accountId,
          accountType: mrPostVerify.data.accountType,
          deviceName: validatedData.deviceName,
          sessionKey: validatedData.sessionKey,
        }),
      );
    } catch (error) {
      return next(error);
    }
  }
}
