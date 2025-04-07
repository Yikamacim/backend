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
      const out = await this.manager.getCountries();
      // >-----------< RESPONSE >-----------<
      return ResponseUtil.controllerResponse(
        res,
        out.httpStatus,
        out.serverError,
        out.clientErrors,
        out.data,
        null,
      );
    } catch (error) {
      return next(error);
    }
  }

  public async getCountries$(
    req: ExpressRequest,
    res: ControllerResponse<CountriesResponse | null, null>,
    next: ExpressNextFunction,
  ): Promise<typeof res | void> {
    try {
      // >----------< VALIDATION >----------<
      const params = CountriesParams.parse(req);
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
      const out = await this.manager.getCountries$(params.data);
      // >----------< RESPONSE >----------<
      return ResponseUtil.controllerResponse(
        res,
        out.httpStatus,
        out.serverError,
        out.clientErrors,
        out.data,
        null,
        false,
      );
    } catch (error) {
      return next(error);
    }
  }
}
