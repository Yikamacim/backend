import type { ControllerResponse } from "../../../@types/responses";
import type { ExpressNextFunction, ExpressRequest } from "../../../@types/wrappers";
import type { IController } from "../../../app/interfaces/IController";
import { ClientError, ClientErrorCode } from "../../../app/schemas/ClientError";
import { HttpStatus, HttpStatusCode } from "../../../app/schemas/HttpStatus";
import { ProtoUtil } from "../../../app/utils/ProtoUtil";
import { ResponseUtil } from "../../../app/utils/ResponseUtil";
import { DistrictsManager } from "./DistrictsManager";
import { DistrictsParams } from "./schemas/DistrictsParams";
import { DistrictsQueries } from "./schemas/DistrictsQueries";
import type { DistrictsResponse } from "./schemas/DistrictsResponse";

export class DistrictsController implements IController {
  public constructor(private readonly manager = new DistrictsManager()) {}

  public async getDistricts$provinceId(
    req: ExpressRequest,
    res: ControllerResponse<DistrictsResponse[], null>,
    next: ExpressNextFunction,
  ): Promise<typeof res | void> {
    try {
      // >----------< REQUEST VALIDATION >----------<
      const preliminaryData: unknown = req.query["provinceId"];
      // V1: Existence validation
      if (!ProtoUtil.isProtovalid(preliminaryData)) {
        return ResponseUtil.controllerResponse(
          res,
          new HttpStatus(HttpStatusCode.BAD_REQUEST),
          null,
          [new ClientError(ClientErrorCode.MISSING_QUERY)],
          [],
          null,
        );
      }
      const protovalidData: unknown = { provinceId: preliminaryData };
      // V2: Schematic validation
      if (!DistrictsQueries.isBlueprint(protovalidData)) {
        return ResponseUtil.controllerResponse(
          res,
          new HttpStatus(HttpStatusCode.BAD_REQUEST),
          null,
          [new ClientError(ClientErrorCode.INVALID_QUERY)],
          [],
          null,
        );
      }
      const blueprintData: DistrictsQueries = protovalidData;
      // V3: Physical validation
      const validationErrors = DistrictsQueries.getValidationErrors(blueprintData);
      if (validationErrors.length > 0) {
        return ResponseUtil.controllerResponse(
          res,
          new HttpStatus(HttpStatusCode.BAD_REQUEST),
          null,
          validationErrors,
          [],
          null,
        );
      }
      const validatedData = blueprintData;
      // >-----------< HAND OVER TO MANAGER >-----------<
      const mrGetDistricts$provinceId = await this.manager.getDistricts$provinceId(validatedData);
      // Check manager response
      if (!mrGetDistricts$provinceId.httpStatus.isSuccess()) {
        // Unsuccessful response
        return ResponseUtil.controllerResponse(
          res,
          mrGetDistricts$provinceId.httpStatus,
          mrGetDistricts$provinceId.serverError,
          mrGetDistricts$provinceId.clientErrors,
          mrGetDistricts$provinceId.data,
          null,
        );
      }
      // Successful response
      return ResponseUtil.controllerResponse(
        res,
        mrGetDistricts$provinceId.httpStatus,
        mrGetDistricts$provinceId.serverError,
        mrGetDistricts$provinceId.clientErrors,
        mrGetDistricts$provinceId.data,
        null,
      );
    } catch (error) {
      return next(error);
    }
  }

  public async getDistricts$districtId(
    req: ExpressRequest,
    res: ControllerResponse<DistrictsResponse | null, null>,
    next: ExpressNextFunction,
  ): Promise<typeof res | void> {
    try {
      // >----------< REQUEST VALIDATION >----------<
      const preliminaryData: unknown = req.params["districtId"];
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
      const protovalidData: unknown = { districtId: preliminaryData };
      // V2: Schematic validation
      if (!DistrictsParams.isBlueprint(protovalidData)) {
        return ResponseUtil.controllerResponse(
          res,
          new HttpStatus(HttpStatusCode.BAD_REQUEST),
          null,
          [new ClientError(ClientErrorCode.INVALID_PARAMETER)],
          null,
          null,
        );
      }
      const blueprintData: DistrictsParams = protovalidData;
      // V3: Physical validation
      const validationErrors = DistrictsParams.getValidationErrors(blueprintData);
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
      const mrGetDistricts$districtId = await this.manager.getDistricts$districtId(validatedData);
      // Check manager response
      if (!mrGetDistricts$districtId.httpStatus.isSuccess()) {
        // Unsuccessful response
        return ResponseUtil.controllerResponse(
          res,
          mrGetDistricts$districtId.httpStatus,
          mrGetDistricts$districtId.serverError,
          mrGetDistricts$districtId.clientErrors,
          null,
          null,
        );
      }
      // Successful response
      return ResponseUtil.controllerResponse(
        res,
        mrGetDistricts$districtId.httpStatus,
        mrGetDistricts$districtId.serverError,
        mrGetDistricts$districtId.clientErrors,
        mrGetDistricts$districtId.data,
        null,
      );
    } catch (error) {
      return next(error);
    }
  }
}
