import { Router } from "express";
import { Method } from "../../../app/enums/Method";
import { RouteType } from "../../../app/enums/RouteType";
import { RouteHelper } from "../../../app/helpers/RouteHelper";
import type { IBuilder } from "../../../app/interfaces/IBuilder";
import { MyCurtainsController } from "./MyCurtainsController";

export class MyCurtainsBuilder implements IBuilder {
  public static readonly BASE_ROUTE = "/my/curtains";

  public constructor(
    public readonly router = Router({ mergeParams: true }),
    private readonly controller = new MyCurtainsController(),
  ) {
    this.buildRoutes();
  }

  private buildRoutes(): void {
    RouteHelper.buildRoute(
      this.router,
      { baseRoute: MyCurtainsBuilder.BASE_ROUTE, route: "/" },
      RouteType.PRIVATE,
      Method.GET,
      this.controller.getMyCurtains.bind(this.controller),
    );
    RouteHelper.buildRoute(
      this.router,
      { baseRoute: MyCurtainsBuilder.BASE_ROUTE, route: "/" },
      RouteType.PRIVATE,
      Method.POST,
      this.controller.postMyCurtains.bind(this.controller),
    );
    RouteHelper.buildRoute(
      this.router,
      { baseRoute: MyCurtainsBuilder.BASE_ROUTE, route: "/:curtainId" },
      RouteType.PRIVATE,
      Method.GET,
      this.controller.getMyCurtains$.bind(this.controller),
    );
    RouteHelper.buildRoute(
      this.router,
      { baseRoute: MyCurtainsBuilder.BASE_ROUTE, route: "/:curtainId" },
      RouteType.PRIVATE,
      Method.PUT,
      this.controller.putMyCurtains$.bind(this.controller),
    );
    RouteHelper.buildRoute(
      this.router,
      { baseRoute: MyCurtainsBuilder.BASE_ROUTE, route: "/:curtainId" },
      RouteType.PRIVATE,
      Method.DELETE,
      this.controller.deleteMyCurtains$.bind(this.controller),
    );
  }
}
