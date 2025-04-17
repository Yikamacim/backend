import { Router } from "express";
import { Method } from "../../../app/enums/Method";
import { RouteType } from "../../../app/enums/RouteType";
import { RouteHelper } from "../../../app/helpers/RouteHelper";
import type { IBuilder } from "../../../app/interfaces/IBuilder";
import { MyQuiltsController } from "./MyQuiltsController";

export class MyQuiltsBuilder implements IBuilder {
  public static readonly BASE_ROUTE = "/my/quilts";

  public constructor(
    public readonly router = Router(),
    private readonly controller = new MyQuiltsController(),
  ) {
    this.buildRoutes();
  }

  private buildRoutes(): void {
    RouteHelper.buildRoute(
      this.router,
      { baseRoute: MyQuiltsBuilder.BASE_ROUTE, route: "/" },
      RouteType.PRIVATE,
      Method.GET,
      this.controller.getMyQuilts.bind(this.controller),
    );
    RouteHelper.buildRoute(
      this.router,
      { baseRoute: MyQuiltsBuilder.BASE_ROUTE, route: "/" },
      RouteType.PRIVATE,
      Method.POST,
      this.controller.postMyQuilts.bind(this.controller),
    );
    RouteHelper.buildRoute(
      this.router,
      { baseRoute: MyQuiltsBuilder.BASE_ROUTE, route: "/:quiltId" },
      RouteType.PRIVATE,
      Method.GET,
      this.controller.getMyQuilts$.bind(this.controller),
    );
    RouteHelper.buildRoute(
      this.router,
      { baseRoute: MyQuiltsBuilder.BASE_ROUTE, route: "/:quiltId" },
      RouteType.PRIVATE,
      Method.PUT,
      this.controller.putMyQuilts$.bind(this.controller),
    );
    RouteHelper.buildRoute(
      this.router,
      { baseRoute: MyQuiltsBuilder.BASE_ROUTE, route: "/:quiltId" },
      RouteType.PRIVATE,
      Method.DELETE,
      this.controller.deleteMyQuilts$.bind(this.controller),
    );
  }
}
