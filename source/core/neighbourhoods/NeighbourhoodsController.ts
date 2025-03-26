import type { ControllerResponse } from "../../@types/responses";
import type { ExpressNextFunction, ExpressRequest } from "../../@types/wrappers";
import type { IController } from "../../app/interfaces/IController";
import { HttpStatus, HttpStatusCode } from "../../app/schemas/HttpStatus";
import { ResponseUtil } from "../../app/utils/ResponseUtil";
import { NeighbourhoodsManager } from "./NeighbourhoodsManager";
import { NeighbourhoodsParams } from "./schemas/NeighbourhoodsParams";
import { NeighbourhoodsQueries } from "./schemas/NeighbourhoodsQueries";
import type { NeighbourhoodsResponse } from "./schemas/NeighbourhoodsResponse";

export class NeighbourhoodsController implements IController {
  public constructor(private readonly manager = new NeighbourhoodsManager()) {}

  public async getNeighbourhoods(
    req: ExpressRequest,
    res: ControllerResponse<NeighbourhoodsResponse[], null>,
    next: ExpressNextFunction,
  ): Promise<typeof res | void> {
    try {
      // >----------< VALIDATION >----------<
      const pr = NeighbourhoodsQueries.parse(req);
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
      const mr = await this.manager.getNeighbourhoods(pr.validatedData);
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

  public async getNeighbourhoods$neighbourhoodId(
    req: ExpressRequest,
    res: ControllerResponse<NeighbourhoodsResponse | null, null>,
    next: ExpressNextFunction,
  ): Promise<typeof res | void> {
    try {
      // >----------< VALIDATION >----------<
      const pr = NeighbourhoodsParams.parse(req);
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
      const mr = await this.manager.getNeighbourhoods$neighbourhoodId(pr.validatedData);
      // >----------< RESPONSE >----------<
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
}
