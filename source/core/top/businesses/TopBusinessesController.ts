import type { ControllerResponse } from "../../../@types/responses";
import type { ExpressNextFunction, ExpressRequest } from "../../../@types/wrappers";
import type { IController } from "../../../app/interfaces/IController";
import { HttpStatus, HttpStatusCode } from "../../../app/schemas/HttpStatus";
import { ResponseUtil } from "../../../app/utils/ResponseUtil";
import { TopBusinessesParams } from "./schemas/TopBusinessesParams";
import type { TopBusinessesResponse } from "./schemas/TopBusinessesResponse";
import { TopBusinessesManager } from "./TopBusinessesManager";

export class TopBusinessesController implements IController {
  public constructor(private readonly manager = new TopBusinessesManager()) {}

  public async getTopBusinesses(
    req: ExpressRequest,
    res: ControllerResponse<TopBusinessesResponse[] | null, null>,
    next: ExpressNextFunction,
  ): Promise<typeof res | void> {
    try {
      // >----------< VALIDATION >----------<
      const params = TopBusinessesParams.parse(req);
      if (params.clientErrors.length > 0 || params.data === null) {
        return ResponseUtil.controllerResponse(
          res,
          new HttpStatus(HttpStatusCode.BAD_REQUEST),
          null,
          params.clientErrors,
          [],
          null,
        );
      }
      // >-----------< LOGIC >-----------<
      const out = await this.manager.getTopBusinesses(params.data);
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
}
