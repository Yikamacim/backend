import type { ControllerResponse } from "../../../@types/responses";
import type { Tokens } from "../../../@types/tokens";
import type { ExpressNextFunction, ExpressRequest } from "../../../@types/wrappers";
import type { IController } from "../../../app/interfaces/IController";
import { HttpStatus, HttpStatusCode } from "../../../app/schemas/HttpStatus";
import { ResponseUtil } from "../../../app/utils/ResponseUtil";
import { BusinessesReviewsParams } from "../reviews/schemas/BusinessesReviewsParams";
import { BusinessesCampaignsManager } from "./BusinessesCampaignsManager";
import type { BusinessesCampaignsResponse } from "./schemas/BusinessesCampaignsResponse";

export class BusinessesCampaignsController implements IController {
  public constructor(private readonly manager = new BusinessesCampaignsManager()) {}

  public async getBusinessesCampaigns(
    req: ExpressRequest,
    res: ControllerResponse<BusinessesCampaignsResponse[] | null, Tokens | null>,
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
      const out = await this.manager.getBusinessesCampaigns(params.data);
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
