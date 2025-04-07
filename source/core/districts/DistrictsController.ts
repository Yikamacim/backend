import type { ControllerResponse } from "../../@types/responses";
import type { ExpressNextFunction, ExpressRequest } from "../../@types/wrappers";
import type { IController } from "../../app/interfaces/IController";
import { HttpStatus, HttpStatusCode } from "../../app/schemas/HttpStatus";
import { ResponseUtil } from "../../app/utils/ResponseUtil";
import { DistrictsManager } from "./DistrictsManager";
import { DistrictsParams } from "./schemas/DistrictsParams";
import { DistrictsQueries } from "./schemas/DistrictsQueries";
import type { DistrictsResponse } from "./schemas/DistrictsResponse";

export class DistrictsController implements IController {
  public constructor(private readonly manager = new DistrictsManager()) {}

  public async getDistricts(
    req: ExpressRequest,
    res: ControllerResponse<DistrictsResponse[], null>,
    next: ExpressNextFunction,
  ): Promise<typeof res | void> {
    try {
      // >----------< VALIDATION >----------<
      const queries = DistrictsQueries.parse(req);
      if (queries.clientErrors.length > 0 || queries.data === null) {
        return ResponseUtil.controllerResponse(
          res,
          new HttpStatus(HttpStatusCode.BAD_REQUEST),
          null,
          queries.clientErrors,
          [],
          null,
        );
      }
      // >-----------< LOGIC >-----------<
      const out = await this.manager.getDistricts(queries.data);
      // >-----------< RESPONSE >-----------<
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

  public async getDistricts$(
    req: ExpressRequest,
    res: ControllerResponse<DistrictsResponse | null, null>,
    next: ExpressNextFunction,
  ): Promise<typeof res | void> {
    try {
      // >----------< VALIDATION >----------<
      const params = DistrictsParams.parse(req);
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
      const out = await this.manager.getDistricts$(params.data);
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
