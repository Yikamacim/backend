import { Router } from "express";
import { Method } from "../../../../app/enums/Method";
import { RouteType } from "../../../../app/enums/RouteType";
import { RouteHelper } from "../../../../app/helpers/RouteHelper";
import type { IBuilder } from "../../../../app/interfaces/IBuilder";
import { MyOrdersReviewController } from "./MyOrdersReviewController";

export class MyOrdersReviewBuilder implements IBuilder {
  public static readonly BASE_ROUTE = "/my/orders/:orderId/review";

  public constructor(
    public readonly router = Router({ mergeParams: true }),
    private readonly controller = new MyOrdersReviewController(),
  ) {
    this.buildRoutes();
  }

  private buildRoutes(): void {
    RouteHelper.buildRoute(
      this.router,
      { baseRoute: MyOrdersReviewBuilder.BASE_ROUTE, route: "/" },
      RouteType.PRIVATE,
      Method.GET,
      this.controller.getMyOrdersReview.bind(this.controller),
    );
    RouteHelper.buildRoute(
      this.router,
      { baseRoute: MyOrdersReviewBuilder.BASE_ROUTE, route: "/" },
      RouteType.PRIVATE,
      Method.POST,
      this.controller.postMyOrdersReview.bind(this.controller),
    );
  }
}
