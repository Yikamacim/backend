import { Router } from "express";
import { Method } from "../../../../app/enums/Method";
import { RouteType } from "../../../../app/enums/RouteType";
import { RouteHelper } from "../../../../app/helpers/RouteHelper";
import type { IBuilder } from "../../../../app/interfaces/IBuilder";
import { MyOrdersCancelController } from "./MyOrdersCancelController";

export class MyOrdersCancelBuilder implements IBuilder {
  public static readonly BASE_ROUTE = "/my/orders/:orderId/cancel";

  public constructor(
    public readonly router = Router({ mergeParams: true }),
    private readonly controller = new MyOrdersCancelController(),
  ) {
    this.buildRoutes();
  }

  private buildRoutes(): void {
    RouteHelper.buildRoute(
      this.router,
      { baseRoute: MyOrdersCancelBuilder.BASE_ROUTE, route: "/" },
      RouteType.PRIVATE,
      Method.PUT,
      this.controller.putMyOrdersCancel.bind(this.controller),
    );
  }
}
