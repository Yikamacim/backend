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
      const pq = DistrictsQueries.parse(req);
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
      const mr = await this.manager.getDistricts(pq.validatedData);
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

  public async getDistricts$districtId(
    req: ExpressRequest,
    res: ControllerResponse<DistrictsResponse | null, null>,
    next: ExpressNextFunction,
  ): Promise<typeof res | void> {
    try {
      // >----------< VALIDATION >----------<
      const pp = DistrictsParams.parse(req);
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
      const mr = await this.manager.getDistricts$districtId(pp.validatedData);
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
