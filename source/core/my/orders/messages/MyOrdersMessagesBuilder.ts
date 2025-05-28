import { Router } from "express";
import { Method } from "../../../../app/enums/Method";
import { RouteType } from "../../../../app/enums/RouteType";
import { RouteHelper } from "../../../../app/helpers/RouteHelper";
import type { IBuilder } from "../../../../app/interfaces/IBuilder";
import { MyOrdersMessagesController } from "./MyOrdersMessagesController";

export class MyOrdersMessagesBuilder implements IBuilder {
  public static readonly BASE_ROUTE = "/my/orders/:orderId/messages";

  public constructor(
    public readonly router = Router({ mergeParams: true }),
    private readonly controller = new MyOrdersMessagesController(),
  ) {
    this.buildRoutes();
  }

  private buildRoutes(): void {
    RouteHelper.buildRoute(
      this.router,
      { baseRoute: MyOrdersMessagesBuilder.BASE_ROUTE, route: "/" },
      RouteType.PRIVATE,
      Method.GET,
      this.controller.getMyOrdersMessages.bind(this.controller),
    );
    RouteHelper.buildRoute(
      this.router,
      { baseRoute: MyOrdersMessagesBuilder.BASE_ROUTE, route: "/" },
      RouteType.PRIVATE,
      Method.POST,
      this.controller.postMyOrdersMessages.bind(this.controller),
    );
  }
}
