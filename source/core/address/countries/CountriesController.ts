import type { ControllerResponse } from "../../../@types/responses";
import type { ExpressNextFunction, ExpressRequest } from "../../../@types/wrappers";
import type { IController } from "../../../app/interfaces/IController";
import { ClientError, ClientErrorCode } from "../../../app/schemas/ClientError";
import { HttpStatus, HttpStatusCode } from "../../../app/schemas/HttpStatus";
import { ProtoUtil } from "../../../app/utils/ProtoUtil";
import { ResponseUtil } from "../../../app/utils/ResponseUtil";
import { CountriesManager } from "./CountriesManager";
import { CountriesParams } from "./schemas/CountriesParams";
import type { CountriesResponse } from "./schemas/CountriesResponse";

export class CountriesController implements IController {
  public constructor(private readonly manager = new CountriesManager()) {}

  public async getCountries(
    _: ExpressRequest,
    res: ControllerResponse<CountriesResponse[], null>,
    next: ExpressNextFunction,
  ): Promise<typeof res | void> {
    try {
      // >-----------< HAND OVER TO MANAGER >-----------<
      const mrGetCountries = await this.manager.getCountries();
      // Check manager response
      if (!mrGetCountries.httpStatus.isSuccess()) {
        // Unsuccessful response
        return ResponseUtil.controllerResponse(
          res,
          mrGetCountries.httpStatus,
          mrGetCountries.serverError,
          mrGetCountries.clientErrors,
          mrGetCountries.data,
          null,
        );
      }
      // Successful response
      return ResponseUtil.controllerResponse(
        res,
        mrGetCountries.httpStatus,
        mrGetCountries.serverError,
        mrGetCountries.clientErrors,
        mrGetCountries.data,
        null,
      );
    } catch (error) {
      return next(error);
    }
  }

  public async getCountries$countryId(
    req: ExpressRequest,
    res: ControllerResponse<CountriesResponse | null, null>,
    next: ExpressNextFunction,
  ): Promise<typeof res | void> {
    try {
      // >----------< REQUEST VALIDATION >----------<
      const preliminaryData: unknown = req.params["countryId"];
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
      const protovalidData: unknown = { countryId: preliminaryData };
      // V2: Schematic validation
      if (!CountriesParams.isBlueprint(protovalidData)) {
        return ResponseUtil.controllerResponse(
          res,
          new HttpStatus(HttpStatusCode.BAD_REQUEST),
          null,
          [new ClientError(ClientErrorCode.INVALID_PARAMETER)],
          null,
          null,
        );
      }
      const blueprintData: CountriesParams = protovalidData;
      // V3: Physical validation
      const validationErrors = CountriesParams.getValidationErrors(blueprintData);
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
      const mrGetCountries$countryId = await this.manager.getCountries$countryId(validatedData);
      // Check manager response
      if (!mrGetCountries$countryId.httpStatus.isSuccess()) {
        // Unsuccessful response
        return ResponseUtil.controllerResponse(
          res,
          mrGetCountries$countryId.httpStatus,
          mrGetCountries$countryId.serverError,
          mrGetCountries$countryId.clientErrors,
          null,
          null,
        );
      }
      // Successful response
      return ResponseUtil.controllerResponse(
        res,
        mrGetCountries$countryId.httpStatus,
        mrGetCountries$countryId.serverError,
        mrGetCountries$countryId.clientErrors,
        mrGetCountries$countryId.data,
        null,
      );
    } catch (error) {
      return next(error);
    }
  }
}
