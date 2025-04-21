import { Router } from "express";
import { Method } from "../../../app/enums/Method";
import { RouteType } from "../../../app/enums/RouteType";
import { RouteHelper } from "../../../app/helpers/RouteHelper";
import type { IBuilder } from "../../../app/interfaces/IBuilder";
import { MyBusinessController } from "./MyBusinessController";

export class MyBusinessBuilder implements IBuilder {
  public static readonly BASE_ROUTE = "/my/business";

  public constructor(
    public readonly router = Router(),
    private readonly controller = new MyBusinessController(),
  ) {
    this.buildRoutes();
  }

  private buildRoutes(): void {
    RouteHelper.buildRoute(
      this.router,
      { baseRoute: MyBusinessBuilder.BASE_ROUTE, route: "/" },
      RouteType.PRIVATE,
      Method.GET,
      this.controller.getMyBusiness.bind(this.controller),
    );
    RouteHelper.buildRoute(
      this.router,
      { baseRoute: MyBusinessBuilder.BASE_ROUTE, route: "/" },
      RouteType.PRIVATE,
      Method.POST,
      this.controller.postMyBusiness.bind(this.controller),
    );
    RouteHelper.buildRoute(
      this.router,
      { baseRoute: MyBusinessBuilder.BASE_ROUTE, route: "/" },
      RouteType.PRIVATE,
      Method.PUT,
      this.controller.putMyBusiness.bind(this.controller),
    );
  }
}
