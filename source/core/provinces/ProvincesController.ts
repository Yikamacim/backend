import type { ControllerResponse } from "../../@types/responses";
import type { ExpressNextFunction, ExpressRequest } from "../../@types/wrappers";
import type { IController } from "../../app/interfaces/IController";
import { HttpStatus, HttpStatusCode } from "../../app/schemas/HttpStatus";
import { ResponseUtil } from "../../app/utils/ResponseUtil";
import { ProvincesManager } from "./ProvincesManager";
import { ProvincesParams } from "./schemas/ProvincesParams";
import { ProvincesQueries } from "./schemas/ProvincesQueries";
import type { ProvincesResponse } from "./schemas/ProvincesResponse";

export class ProvincesController implements IController {
  public constructor(private readonly manager = new ProvincesManager()) {}

  public async getProvinces(
    req: ExpressRequest,
    res: ControllerResponse<ProvincesResponse[], null>,
    next: ExpressNextFunction,
  ): Promise<typeof res | void> {
    try {
      // >----------< VALIDATION >----------<
      const pq = ProvincesQueries.parse(req);
      if (pq.clientErrors.length > 0 || pq.validatedData === null) {
        return ResponseUtil.controllerResponse(
          res,
          new HttpStatus(HttpStatusCode.BAD_REQUEST),
          null,
          pq.clientErrors,
          [],
          null,
        );
      }
      // >-----------< LOGIC >-----------<
      const mr = await this.manager.getProvinces(pq.validatedData);
      // >-----------< RESPONSE >-----------<
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

  public async getProvinces$provinceId(
    req: ExpressRequest,
    res: ControllerResponse<ProvincesResponse | null, null>,
    next: ExpressNextFunction,
  ): Promise<typeof res | void> {
    try {
      // >----------< VALIDATION >----------<
      const pp = ProvincesParams.parse(req);
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
      const mr = await this.manager.getProvinces$provinceId(pp.validatedData);
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
