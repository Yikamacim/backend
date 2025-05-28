import { Router } from "express";
import { Method } from "../../../../app/enums/Method";
import { RouteType } from "../../../../app/enums/RouteType";
import { RouteHelper } from "../../../../app/helpers/RouteHelper";
import type { IBuilder } from "../../../../app/interfaces/IBuilder";
import { MyOrdersCompleteController } from "./MyOrdersCompleteController";

export class MyOrdersCompleteBuilder implements IBuilder {
  public static readonly BASE_ROUTE = "/my/orders/:orderId/complete";

  public constructor(
    public readonly router = Router({ mergeParams: true }),
    private readonly controller = new MyOrdersCompleteController(),
  ) {
    this.buildRoutes();
  }

  private buildRoutes(): void {
    RouteHelper.buildRoute(
      this.router,
      { baseRoute: MyOrdersCompleteBuilder.BASE_ROUTE, route: "/" },
      RouteType.PRIVATE,
      Method.PUT,
      this.controller.putMyOrdersComplete.bind(this.controller),
    );
  }
}
