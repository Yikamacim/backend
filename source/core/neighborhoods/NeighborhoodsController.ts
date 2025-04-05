import type { ControllerResponse } from "../../@types/responses";
import type { ExpressNextFunction, ExpressRequest } from "../../@types/wrappers";
import type { IController } from "../../app/interfaces/IController";
import { HttpStatus, HttpStatusCode } from "../../app/schemas/HttpStatus";
import { ResponseUtil } from "../../app/utils/ResponseUtil";
import { NeighborhoodsManager } from "./NeighborhoodsManager";
import { NeighborhoodsParams } from "./schemas/NeighborhoodsParams";
import { NeighborhoodsQueries } from "./schemas/NeighborhoodsQueries";
import type { NeighborhoodsResponse } from "./schemas/NeighborhoodsResponse";

export class NeighborhoodsController implements IController {
  public constructor(private readonly manager = new NeighborhoodsManager()) {}

  public async getNeighborhoods(
    req: ExpressRequest,
    res: ControllerResponse<NeighborhoodsResponse[], null>,
    next: ExpressNextFunction,
  ): Promise<typeof res | void> {
    try {
      // >----------< VALIDATION >----------<
      const pq = NeighborhoodsQueries.parse(req);
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
      const mr = await this.manager.getNeighborhoods(pq.validatedData);
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

  public async getNeighborhoods$neighborhoodId(
    req: ExpressRequest,
    res: ControllerResponse<NeighborhoodsResponse | null, null>,
    next: ExpressNextFunction,
  ): Promise<typeof res | void> {
    try {
      // >----------< VALIDATION >----------<
      const pp = NeighborhoodsParams.parse(req);
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
      const mr = await this.manager.getNeighborhoods$neighborhoodId(pp.validatedData);
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
