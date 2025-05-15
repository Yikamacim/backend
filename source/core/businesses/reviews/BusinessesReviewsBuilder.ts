import { Router } from "express";
import { Method } from "../../../app/enums/Method";
import { RouteType } from "../../../app/enums/RouteType";
import { RouteHelper } from "../../../app/helpers/RouteHelper";
import type { IBuilder } from "../../../app/interfaces/IBuilder";
import { BusinessesReviewsController } from "./BusinessesReviewsController";

export class BusinessesReviewsBuilder implements IBuilder {
  public static readonly BASE_ROUTE = "/businesses/:businessId/reviews";

  public constructor(
    public readonly router = Router({ mergeParams: true }),
    private readonly controller = new BusinessesReviewsController(),
  ) {
    this.buildRoutes();
  }

  private buildRoutes(): void {
    RouteHelper.buildRoute(
      this.router,
      { baseRoute: BusinessesReviewsBuilder.BASE_ROUTE, route: "/" },
      RouteType.PUBLIC,
      Method.GET,
      this.controller.getBusinessesReviews.bind(this.controller),
    );
  }
}
