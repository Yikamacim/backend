import type { ControllerResponse } from "../../../@types/responses";
import type { Tokens } from "../../../@types/tokens";
import type { ExpressNextFunction, ExpressRequest } from "../../../@types/wrappers";
import type { IController } from "../../../app/interfaces/IController";
import { HttpStatus, HttpStatusCode } from "../../../app/schemas/HttpStatus";
import { ResponseUtil } from "../../../app/utils/ResponseUtil";
import { BusinessesReviewsManager } from "./BusinessesReviewsManager";
import { BusinessesReviewsParams } from "./schemas/BusinessesReviewsParams";
import type { BusinessesReviewsResponse } from "./schemas/BusinessesReviewsResponse";

export class BusinessesReviewsController implements IController {
  public constructor(private readonly manager = new BusinessesReviewsManager()) {}

  public async getBusinessesReviews(
    req: ExpressRequest,
    res: ControllerResponse<BusinessesReviewsResponse[] | null, Tokens | null>,
    next: ExpressNextFunction,
  ): Promise<typeof res | void> {
    try {
      // >----------< VALIDATION >----------<
      const params = BusinessesReviewsParams.parse(req);
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
      const out = await this.manager.getBusinessesReviews(params.data);
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
