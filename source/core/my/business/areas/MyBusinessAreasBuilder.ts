import { Router } from "express";
import { Method } from "../../../../app/enums/Method";
import { RouteType } from "../../../../app/enums/RouteType";
import { RouteHelper } from "../../../../app/helpers/RouteHelper";
import type { IBuilder } from "../../../../app/interfaces/IBuilder";
import { MyBusinessAreasController } from "./MyBusinessAreasController";

export class MyBusinessAreasBuilder implements IBuilder {
  public static readonly BASE_ROUTE = "/my/business/areas";

  public constructor(
    public readonly router = Router(),
    private readonly controller = new MyBusinessAreasController(),
  ) {
    this.buildRoutes();
  }

  private buildRoutes(): void {
    RouteHelper.buildRoute(
      this.router,
      { baseRoute: MyBusinessAreasBuilder.BASE_ROUTE, route: "/" },
      RouteType.PRIVATE,
      Method.GET,
      this.controller.getMyBusinessAreas.bind(this.controller),
    );
    RouteHelper.buildRoute(
      this.router,
      { baseRoute: MyBusinessAreasBuilder.BASE_ROUTE, route: "/" },
      RouteType.PRIVATE,
      Method.POST,
      this.controller.postMyBusinessAreas.bind(this.controller),
    );
    RouteHelper.buildRoute(
      this.router,
      { baseRoute: MyBusinessAreasBuilder.BASE_ROUTE, route: "/:neighborhoodId" },
      RouteType.PRIVATE,
      Method.DELETE,
      this.controller.deleteMyBusinessAreas$.bind(this.controller),
    );
  }
}
