import { Router } from "express";
import { Method } from "../../../../app/enums/Method";
import { RouteType } from "../../../../app/enums/RouteType";
import { RouteHelper } from "../../../../app/helpers/RouteHelper";
import type { IBuilder } from "../../../../app/interfaces/IBuilder";
import { MyBusinessHoursController } from "./MyBusinessHoursController";

export class MyBusinessHoursBuilder implements IBuilder {
  public static readonly BASE_ROUTE = "/my/business/hours";

  public constructor(
    public readonly router = Router(),
    private readonly controller = new MyBusinessHoursController(),
  ) {
    this.buildRoutes();
  }

  private buildRoutes(): void {
    RouteHelper.buildRoute(
      this.router,
      { baseRoute: MyBusinessHoursBuilder.BASE_ROUTE, route: "/" },
      RouteType.PRIVATE,
      Method.GET,
      this.controller.getMyBusinessHours.bind(this.controller),
    );
    RouteHelper.buildRoute(
      this.router,
      { baseRoute: MyBusinessHoursBuilder.BASE_ROUTE, route: "/" },
      RouteType.PRIVATE,
      Method.POST,
      this.controller.postMyBusinessHours.bind(this.controller),
    );
    RouteHelper.buildRoute(
      this.router,
      { baseRoute: MyBusinessHoursBuilder.BASE_ROUTE, route: "/" },
      RouteType.PRIVATE,
      Method.PUT,
      this.controller.putMyBusinessHours.bind(this.controller),
    );
  }
}
