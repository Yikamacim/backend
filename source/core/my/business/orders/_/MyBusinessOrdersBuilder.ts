import { Router } from "express";
import { Method } from "../../../../../app/enums/Method";
import { RouteType } from "../../../../../app/enums/RouteType";
import { RouteHelper } from "../../../../../app/helpers/RouteHelper";
import type { IBuilder } from "../../../../../app/interfaces/IBuilder";
import { MyBusinessOrdersController } from "./MyBusinessOrdersController";

export class MyBusinessOrdersBuilder implements IBuilder {
  public static readonly BASE_ROUTE = "/my/business/orders";

  public constructor(
    public readonly router = Router({ mergeParams: true }),
    private readonly controller = new MyBusinessOrdersController(),
  ) {
    this.buildRoutes();
  }

  private buildRoutes(): void {
    RouteHelper.buildRoute(
      this.router,
      { baseRoute: MyBusinessOrdersBuilder.BASE_ROUTE, route: "/" },
      RouteType.PRIVATE,
      Method.GET,
      this.controller.getMyBusinessOrders.bind(this.controller),
    );
    RouteHelper.buildRoute(
      this.router,
      { baseRoute: MyBusinessOrdersBuilder.BASE_ROUTE, route: "/:orderId" },
      RouteType.PRIVATE,
      Method.GET,
      this.controller.getMyBusinessOrders$.bind(this.controller),
    );
  }
}
