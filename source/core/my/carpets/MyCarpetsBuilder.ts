import { Router } from "express";
import { Method } from "../../../app/enums/Method";
import { RouteType } from "../../../app/enums/RouteType";
import { RouteHelper } from "../../../app/helpers/RouteHelper";
import type { IBuilder } from "../../../app/interfaces/IBuilder";
import { MyCarpetsController } from "./MyCarpetsController";

export class MyCarpetsBuilder implements IBuilder {
  public static readonly BASE_ROUTE = "/my/carpets";

  public constructor(
    public readonly router = Router(),
    private readonly controller = new MyCarpetsController(),
  ) {
    this.buildRoutes();
  }

  private buildRoutes(): void {
    RouteHelper.buildRoute(
      this.router,
      { baseRoute: MyCarpetsBuilder.BASE_ROUTE, route: "/" },
      RouteType.PRIVATE,
      Method.GET,
      this.controller.getMyCarpets.bind(this.controller),
    );
    RouteHelper.buildRoute(
      this.router,
      { baseRoute: MyCarpetsBuilder.BASE_ROUTE, route: "/" },
      RouteType.PRIVATE,
      Method.POST,
      this.controller.postMyCarpets.bind(this.controller),
    );
    RouteHelper.buildRoute(
      this.router,
      { baseRoute: MyCarpetsBuilder.BASE_ROUTE, route: "/:carpetId" },
      RouteType.PRIVATE,
      Method.GET,
      this.controller.getMyCarpets$.bind(this.controller),
    );
    RouteHelper.buildRoute(
      this.router,
      { baseRoute: MyCarpetsBuilder.BASE_ROUTE, route: "/:carpetId" },
      RouteType.PRIVATE,
      Method.PUT,
      this.controller.putMyCarpets$.bind(this.controller),
    );
    RouteHelper.buildRoute(
      this.router,
      { baseRoute: MyCarpetsBuilder.BASE_ROUTE, route: "/:carpetId" },
      RouteType.PRIVATE,
      Method.DELETE,
      this.controller.deleteMyCarpets$.bind(this.controller),
    );
  }
}
