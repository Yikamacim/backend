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
      const queries = NeighborhoodsQueries.parse(req);
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
      const out = await this.manager.getNeighborhoods(queries.data);
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

  public async getNeighborhoods$(
    req: ExpressRequest,
    res: ControllerResponse<NeighborhoodsResponse | null, null>,
    next: ExpressNextFunction,
  ): Promise<typeof res | void> {
    try {
      // >----------< VALIDATION >----------<
      const params = NeighborhoodsParams.parse(req);
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
      const out = await this.manager.getNeighborhoods$(params.data);
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
