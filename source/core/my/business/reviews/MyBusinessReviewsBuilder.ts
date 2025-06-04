import { Router } from "express";
import { Method } from "../../../../app/enums/Method";
import { RouteType } from "../../../../app/enums/RouteType";
import { RouteHelper } from "../../../../app/helpers/RouteHelper";
import type { IBuilder } from "../../../../app/interfaces/IBuilder";
import { MyBusinessReviewsController } from "./MyBusinessReviewsController";

export class MyBusinessReviewsBuilder implements IBuilder {
  public static readonly BASE_ROUTE = "/my/business/reviews";

  public constructor(
    public readonly router = Router({ mergeParams: true }),
    private readonly controller = new MyBusinessReviewsController(),
  ) {
    this.buildRoutes();
  }

  private buildRoutes(): void {
    RouteHelper.buildRoute(
      this.router,
      { baseRoute: MyBusinessReviewsBuilder.BASE_ROUTE, route: "/" },
      RouteType.PRIVATE,
      Method.GET,
      this.controller.getMyBusinessReviews.bind(this.controller),
    );
    RouteHelper.buildRoute(
      this.router,
      { baseRoute: MyBusinessReviewsBuilder.BASE_ROUTE, route: "/:reviewId" },
      RouteType.PRIVATE,
      Method.GET,
      this.controller.getMyBusinessReviews$.bind(this.controller),
    );
    RouteHelper.buildRoute(
      this.router,
      { baseRoute: MyBusinessReviewsBuilder.BASE_ROUTE, route: "/:reviewId" },
      RouteType.PRIVATE,
      Method.POST,
      this.controller.putMyBusinessReviews$.bind(this.controller),
    );
  }
}
