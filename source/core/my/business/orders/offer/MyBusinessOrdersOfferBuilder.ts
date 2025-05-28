import { Router } from "express";
import { Method } from "../../../../../app/enums/Method";
import { RouteType } from "../../../../../app/enums/RouteType";
import { RouteHelper } from "../../../../../app/helpers/RouteHelper";
import type { IBuilder } from "../../../../../app/interfaces/IBuilder";
import { MyBusinessOrdersOfferController } from "./MyBusinessOrdersOfferController";

export class MyBusinessOrdersOfferBuilder implements IBuilder {
  public static readonly BASE_ROUTE = "/my/business/orders/:orderId/offer";

  public constructor(
    public readonly router = Router({ mergeParams: true }),
    private readonly controller = new MyBusinessOrdersOfferController(),
  ) {
    this.buildRoutes();
  }

  private buildRoutes(): void {
    RouteHelper.buildRoute(
      this.router,
      { baseRoute: MyBusinessOrdersOfferBuilder.BASE_ROUTE, route: "/" },
      RouteType.PRIVATE,
      Method.POST,
      this.controller.postMyBusinessOrdersOffer.bind(this.controller),
    );
    RouteHelper.buildRoute(
      this.router,
      { baseRoute: MyBusinessOrdersOfferBuilder.BASE_ROUTE, route: "/" },
      RouteType.PRIVATE,
      Method.DELETE,
      this.controller.deleteMyBusinessOrdersOffer.bind(this.controller),
    );
  }
}
