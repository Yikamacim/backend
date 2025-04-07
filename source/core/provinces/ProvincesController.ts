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
      const queries = ProvincesQueries.parse(req);
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
      const out = await this.manager.getProvinces(queries.data);
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

  public async getProvinces$(
    req: ExpressRequest,
    res: ControllerResponse<ProvincesResponse | null, null>,
    next: ExpressNextFunction,
  ): Promise<typeof res | void> {
    try {
      // >----------< VALIDATION >----------<
      const params = ProvincesParams.parse(req);
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
      const out = await this.manager.getProvinces$(params.data);
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
