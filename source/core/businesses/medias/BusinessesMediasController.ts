import type { ControllerResponse } from "../../../@types/responses";
import type { Tokens } from "../../../@types/tokens";
import type { ExpressNextFunction, ExpressRequest } from "../../../@types/wrappers";
import type { IController } from "../../../app/interfaces/IController";
import { HttpStatus, HttpStatusCode } from "../../../app/schemas/HttpStatus";
import { ResponseUtil } from "../../../app/utils/ResponseUtil";
import { BusinessesMediasManager } from "./BusinessesMediasManager";
import { BusinessesMediasParams } from "./schemas/BusinessesMediasParams";
import type { BusinessesMediasResponse } from "./schemas/BusinessesMediasResponse";

export class BusinessesMediasController implements IController {
  public constructor(private readonly manager = new BusinessesMediasManager()) {}

  public async getBusinessesMedias(
    req: ExpressRequest,
    res: ControllerResponse<BusinessesMediasResponse[] | null, Tokens | null>,
    next: ExpressNextFunction,
  ): Promise<typeof res | void> {
    try {
      // >----------< VALIDATION >----------<
      const params = BusinessesMediasParams.parse(req);
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
      const out = await this.manager.getBusinessesMedias(params.data);
      // >----------< RESPONSE >----------<
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
}
