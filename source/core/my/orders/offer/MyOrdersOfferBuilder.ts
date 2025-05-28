import { Router } from "express";
import { Method } from "../../../../app/enums/Method";
import { RouteType } from "../../../../app/enums/RouteType";
import { RouteHelper } from "../../../../app/helpers/RouteHelper";
import type { IBuilder } from "../../../../app/interfaces/IBuilder";
import { MyOrdersOfferController } from "./MyOrdersOfferController";

export class MyOrdersOfferBuilder implements IBuilder {
  public static readonly BASE_ROUTE = "/my/orders/:orderId/offer";

  public constructor(
    public readonly router = Router({ mergeParams: true }),
    private readonly controller = new MyOrdersOfferController(),
  ) {
    this.buildRoutes();
  }

  private buildRoutes(): void {
    RouteHelper.buildRoute(
      this.router,
      { baseRoute: MyOrdersOfferBuilder.BASE_ROUTE, route: "/" },
      RouteType.PRIVATE,
      Method.DELETE,
      this.controller.deleteMyOrdersOffer.bind(this.controller),
    );
  }
}
