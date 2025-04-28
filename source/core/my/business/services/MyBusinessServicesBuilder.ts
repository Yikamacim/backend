import { Router } from "express";
import { Method } from "../../../../app/enums/Method";
import { RouteType } from "../../../../app/enums/RouteType";
import { RouteHelper } from "../../../../app/helpers/RouteHelper";
import type { IBuilder } from "../../../../app/interfaces/IBuilder";
import { MyBusinessServicesController } from "./MyBusinessServicesController";

export class MyBusinessServicesBuilder implements IBuilder {
  public static readonly BASE_ROUTE = "/my/business/services";

  public constructor(
    public readonly router = Router(),
    private readonly controller = new MyBusinessServicesController(),
  ) {
    this.buildRoutes();
  }

  private buildRoutes(): void {
    RouteHelper.buildRoute(
      this.router,
      { baseRoute: MyBusinessServicesBuilder.BASE_ROUTE, route: "/" },
      RouteType.PRIVATE,
      Method.GET,
      this.controller.getMyBusinessServices.bind(this.controller),
    );
    RouteHelper.buildRoute(
      this.router,
      { baseRoute: MyBusinessServicesBuilder.BASE_ROUTE, route: "/" },
      RouteType.PRIVATE,
      Method.POST,
      this.controller.postMyBusinessServices.bind(this.controller),
    );
    RouteHelper.buildRoute(
      this.router,
      { baseRoute: MyBusinessServicesBuilder.BASE_ROUTE, route: "/:serviceId" },
      RouteType.PRIVATE,
      Method.GET,
      this.controller.getMyBusinessServices$.bind(this.controller),
    );
    RouteHelper.buildRoute(
      this.router,
      { baseRoute: MyBusinessServicesBuilder.BASE_ROUTE, route: "/:serviceId" },
      RouteType.PRIVATE,
      Method.PUT,
      this.controller.putMyBusinessServices$.bind(this.controller),
    );
    RouteHelper.buildRoute(
      this.router,
      { baseRoute: MyBusinessServicesBuilder.BASE_ROUTE, route: "/:serviceId" },
      RouteType.PRIVATE,
      Method.DELETE,
      this.controller.deleteMyBusinessServices$.bind(this.controller),
    );
  }
}
