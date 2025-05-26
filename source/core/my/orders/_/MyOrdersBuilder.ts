import { Router } from "express";
import { Method } from "../../../../app/enums/Method";
import { RouteType } from "../../../../app/enums/RouteType";
import { RouteHelper } from "../../../../app/helpers/RouteHelper";
import type { IBuilder } from "../../../../app/interfaces/IBuilder";

export class MyOrdersBuilder implements IBuilder {
  public static readonly BASE_ROUTE = "/my/orders";

  public constructor(
    public readonly router = Router({ mergeParams: true }),
    private readonly controller = new MyOrdersController(),
  ) {
    this.buildRoutes();
  }

  private buildRoutes(): void {
    RouteHelper.buildRoute(
      this.router,
      { baseRoute: MyOrdersBuilder.BASE_ROUTE, route: "/" },
      RouteType.PRIVATE,
      Method.GET,
      this.controller.getMyOrders.bind(this.controller),
    );
    RouteHelper.buildRoute(
      this.router,
      { baseRoute: MyOrdersBuilder.BASE_ROUTE, route: "/" },
      RouteType.PRIVATE,
      Method.POST,
      this.controller.postMyOrders.bind(this.controller),
    );
    RouteHelper.buildRoute(
      this.router,
      { baseRoute: MyOrdersBuilder.BASE_ROUTE, route: "/:orderId" },
      RouteType.PRIVATE,
      Method.GET,
      this.controller.getMyOrders$.bind(this.controller),
    );
  }
}
