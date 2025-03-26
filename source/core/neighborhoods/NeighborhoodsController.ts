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
      const pr = NeighborhoodsQueries.parse(req);
      if (pr.clientErrors.length > 0 || pr.validatedData === null) {
        return ResponseUtil.controllerResponse(
          res,
          new HttpStatus(HttpStatusCode.BAD_REQUEST),
          null,
          pr.clientErrors,
          [],
          null,
        );
      }
      // >-----------< LOGIC >-----------<
      const mr = await this.manager.getNeighborhoods(pr.validatedData);
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
      const pr = NeighborhoodsParams.parse(req);
      if (pr.clientErrors.length > 0 || pr.validatedData === null) {
        return ResponseUtil.controllerResponse(
          res,
          new HttpStatus(HttpStatusCode.BAD_REQUEST),
          null,
          pr.clientErrors,
          null,
          null,
        );
      }
      // >----------< LOGIC >----------<
      const mr = await this.manager.getNeighborhoods$neighborhoodId(pr.validatedData);
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
