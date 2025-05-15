import { Router } from "express";
import { Method } from "../../../app/enums/Method";
import { RouteType } from "../../../app/enums/RouteType";
import { RouteHelper } from "../../../app/helpers/RouteHelper";
import type { IBuilder } from "../../../app/interfaces/IBuilder";
import { MyBedsController } from "./MyBedsController";

export class MyBedsBuilder implements IBuilder {
  public static readonly BASE_ROUTE = "/my/beds";

  public constructor(
    public readonly router = Router({ mergeParams: true }),
    private readonly controller = new MyBedsController(),
  ) {
    this.buildRoutes();
  }

  private buildRoutes(): void {
    RouteHelper.buildRoute(
      this.router,
      { baseRoute: MyBedsBuilder.BASE_ROUTE, route: "/" },
      RouteType.PRIVATE,
      Method.GET,
      this.controller.getMyBeds.bind(this.controller),
    );
    RouteHelper.buildRoute(
      this.router,
      { baseRoute: MyBedsBuilder.BASE_ROUTE, route: "/" },
      RouteType.PRIVATE,
      Method.POST,
      this.controller.postMyBeds.bind(this.controller),
    );
    RouteHelper.buildRoute(
      this.router,
      { baseRoute: MyBedsBuilder.BASE_ROUTE, route: "/:bedId" },
      RouteType.PRIVATE,
      Method.GET,
      this.controller.getMyBeds$.bind(this.controller),
    );
    RouteHelper.buildRoute(
      this.router,
      { baseRoute: MyBedsBuilder.BASE_ROUTE, route: "/:bedId" },
      RouteType.PRIVATE,
      Method.PUT,
      this.controller.putMyBeds$.bind(this.controller),
    );
    RouteHelper.buildRoute(
      this.router,
      { baseRoute: MyBedsBuilder.BASE_ROUTE, route: "/:bedId" },
      RouteType.PRIVATE,
      Method.DELETE,
      this.controller.deleteMyBeds$.bind(this.controller),
    );
  }
}
