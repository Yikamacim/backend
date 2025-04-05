import type { ControllerResponse } from "../../@types/responses";
import type { ExpressNextFunction, ExpressRequest } from "../../@types/wrappers";
import type { IController } from "../../app/interfaces/IController";
import { HttpStatus, HttpStatusCode } from "../../app/schemas/HttpStatus";
import { ResponseUtil } from "../../app/utils/ResponseUtil";
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
      // >-----------< LOGIC >-----------<
      const mr = await this.manager.getCountries();
      // >-----------< RESPONSE >-----------<
      return ResponseUtil.controllerResponse(
        res,
        mr.httpStatus,
        mr.serverError,
        mr.clientErrors,
        mr.data,
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
      // >----------< VALIDATION >----------<
      const pp = CountriesParams.parse(req);
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
      const mr = await this.manager.getCountries$countryId(pp.validatedData);
      // >----------< RESPONSE >----------<
      return ResponseUtil.controllerResponse(
        res,
        mr.httpStatus,
        mr.serverError,
        mr.clientErrors,
        mr.data,
        null,
        false,
      );
    } catch (error) {
      return next(error);
    }
  }
}
