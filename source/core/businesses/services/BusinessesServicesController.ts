import type { ControllerResponse } from "../../../@types/responses";
import type { Tokens } from "../../../@types/tokens";
import type { ExpressNextFunction, ExpressRequest } from "../../../@types/wrappers";
import type { IController } from "../../../app/interfaces/IController";
import { HttpStatus, HttpStatusCode } from "../../../app/schemas/HttpStatus";
import { ResponseUtil } from "../../../app/utils/ResponseUtil";
import { BusinessesServicesManager } from "./BusinessesServicesManager";
import { BusinessesServicesParams } from "./schemas/BusinessesServicesParams";
import type { BusinessesServicesResponse } from "./schemas/BusinessesServicesResponse";

export class BusinessesServicesController implements IController {
  public constructor(private readonly manager = new BusinessesServicesManager()) {}

  public async getBusinessesServices(
    req: ExpressRequest,
    res: ControllerResponse<BusinessesServicesResponse[] | null, Tokens | null>,
    next: ExpressNextFunction,
  ): Promise<typeof res | void> {
    try {
      // >----------< VALIDATION >----------<
      const params = BusinessesServicesParams.parse(req);
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
      const out = await this.manager.getBusinessesServices(params.data);
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
