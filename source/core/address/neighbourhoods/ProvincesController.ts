import type { ControllerResponse } from "../../../@types/responses";
import type { ExpressNextFunction, ExpressRequest } from "../../../@types/wrappers";
import type { IController } from "../../../app/interfaces/IController";
import { ClientError, ClientErrorCode } from "../../../app/schemas/ClientError";
import { HttpStatus, HttpStatusCode } from "../../../app/schemas/HttpStatus";
import { ProtoUtil } from "../../../app/utils/ProtoUtil";
import { ResponseUtil } from "../../../app/utils/ResponseUtil";
import { ProvincesManager } from "./ProvincesManager";
import { ProvincesParams } from "./schemas/ProvincesParams";
import { ProvincesQueries } from "./schemas/ProvincesQueries";
import type { ProvincesResponse } from "./schemas/ProvincesResponse";

export class ProvincesController implements IController {
  public constructor(private readonly manager = new ProvincesManager()) {}

  public async getProvinces$countryId(
    req: ExpressRequest,
    res: ControllerResponse<ProvincesResponse[], null>,
    next: ExpressNextFunction,
  ): Promise<typeof res | void> {
    try {
      // >----------< REQUEST VALIDATION >----------<
      const preliminaryData: unknown = req.query["countryId"];
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
      const protovalidData: unknown = { countryId: preliminaryData };
      // V2: Schematic validation
      if (!ProvincesQueries.isBlueprint(protovalidData)) {
        return ResponseUtil.controllerResponse(
          res,
          new HttpStatus(HttpStatusCode.BAD_REQUEST),
          null,
          [new ClientError(ClientErrorCode.INVALID_QUERY)],
          [],
          null,
        );
      }
      const blueprintData: ProvincesQueries = protovalidData;
      // V3: Physical validation
      const validationErrors = ProvincesQueries.getValidationErrors(blueprintData);
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
      const mrGetProvinces$countryId = await this.manager.getProvinces$countryId(validatedData);
      // Check manager response
      if (!mrGetProvinces$countryId.httpStatus.isSuccess()) {
        // Unsuccessful response
        return ResponseUtil.controllerResponse(
          res,
          mrGetProvinces$countryId.httpStatus,
          mrGetProvinces$countryId.serverError,
          mrGetProvinces$countryId.clientErrors,
          mrGetProvinces$countryId.data,
          null,
        );
      }
      // Successful response
      return ResponseUtil.controllerResponse(
        res,
        mrGetProvinces$countryId.httpStatus,
        mrGetProvinces$countryId.serverError,
        mrGetProvinces$countryId.clientErrors,
        mrGetProvinces$countryId.data,
        null,
      );
    } catch (error) {
      return next(error);
    }
  }

  public async getProvinces$provinceId(
    req: ExpressRequest,
    res: ControllerResponse<ProvincesResponse | null, null>,
    next: ExpressNextFunction,
  ): Promise<typeof res | void> {
    try {
      // >----------< REQUEST VALIDATION >----------<
      const preliminaryData: unknown = req.params["provinceId"];
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
      const protovalidData: unknown = { provinceId: preliminaryData };
      // V2: Schematic validation
      if (!ProvincesParams.isBlueprint(protovalidData)) {
        return ResponseUtil.controllerResponse(
          res,
          new HttpStatus(HttpStatusCode.BAD_REQUEST),
          null,
          [new ClientError(ClientErrorCode.INVALID_PARAMETER)],
          null,
          null,
        );
      }
      const blueprintData: ProvincesParams = protovalidData;
      // V3: Physical validation
      const validationErrors = ProvincesParams.getValidationErrors(blueprintData);
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
      const mrGetProvinces$provinceId = await this.manager.getProvinces$provinceId(validatedData);
      // Check manager response
      if (!mrGetProvinces$provinceId.httpStatus.isSuccess()) {
        // Unsuccessful response
        return ResponseUtil.controllerResponse(
          res,
          mrGetProvinces$provinceId.httpStatus,
          mrGetProvinces$provinceId.serverError,
          mrGetProvinces$provinceId.clientErrors,
          null,
          null,
        );
      }
      // Successful response
      return ResponseUtil.controllerResponse(
        res,
        mrGetProvinces$provinceId.httpStatus,
        mrGetProvinces$provinceId.serverError,
        mrGetProvinces$provinceId.clientErrors,
        mrGetProvinces$provinceId.data,
        null,
      );
    } catch (error) {
      return next(error);
    }
  }
}
