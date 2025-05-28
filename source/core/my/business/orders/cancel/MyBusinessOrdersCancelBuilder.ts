import { Router } from "express";
import { Method } from "../../../../../app/enums/Method";
import { RouteType } from "../../../../../app/enums/RouteType";
import { RouteHelper } from "../../../../../app/helpers/RouteHelper";
import type { IBuilder } from "../../../../../app/interfaces/IBuilder";
import { MyBusinessOrdersCancelController } from "./MyBusinessOrdersCancelController";

export class MyBusinessOrdersCancelBuilder implements IBuilder {
  public static readonly BASE_ROUTE = "/my/business/orders/:orderId/cancel";

  public constructor(
    public readonly router = Router({ mergeParams: true }),
    private readonly controller = new MyBusinessOrdersCancelController(),
  ) {
    this.buildRoutes();
  }

  private buildRoutes(): void {
    RouteHelper.buildRoute(
      this.router,
      { baseRoute: MyBusinessOrdersCancelBuilder.BASE_ROUTE, route: "/" },
      RouteType.PRIVATE,
      Method.PUT,
      this.controller.putMyBusinessOrdersCancel.bind(this.controller),
    );
  }
}
