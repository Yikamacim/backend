import { Router } from "express";
import { Method } from "../../../../../app/enums/Method";
import { RouteType } from "../../../../../app/enums/RouteType";
import { RouteHelper } from "../../../../../app/helpers/RouteHelper";
import type { IBuilder } from "../../../../../app/interfaces/IBuilder";
import { MyBusinessOrdersMessagesController } from "./MyBusinessOrdersMessagesController";

export class MyBusinessOrdersMessagesBuilder implements IBuilder {
  public static readonly BASE_ROUTE = "/my/business/orders/:orderId/messages";

  public constructor(
    public readonly router = Router({ mergeParams: true }),
    private readonly controller = new MyBusinessOrdersMessagesController(),
  ) {
    this.buildRoutes();
  }

  private buildRoutes(): void {
    RouteHelper.buildRoute(
      this.router,
      { baseRoute: MyBusinessOrdersMessagesBuilder.BASE_ROUTE, route: "/" },
      RouteType.PRIVATE,
      Method.GET,
      this.controller.getMyBusinessOrdersMessages.bind(this.controller),
    );
    RouteHelper.buildRoute(
      this.router,
      { baseRoute: MyBusinessOrdersMessagesBuilder.BASE_ROUTE, route: "/" },
      RouteType.PRIVATE,
      Method.POST,
      this.controller.postMyBusinessOrdersMessages.bind(this.controller),
    );
  }
}
