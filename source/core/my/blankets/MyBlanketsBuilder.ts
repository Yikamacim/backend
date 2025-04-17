import { Router } from "express";
import { Method } from "../../../app/enums/Method";
import { RouteType } from "../../../app/enums/RouteType";
import { RouteHelper } from "../../../app/helpers/RouteHelper";
import type { IBuilder } from "../../../app/interfaces/IBuilder";
import { MyBlanketsController } from "./MyBlanketsController";

export class MyBlanketsBuilder implements IBuilder {
  public static readonly BASE_ROUTE = "/my/blankets";

  public constructor(
    public readonly router = Router(),
    private readonly controller = new MyBlanketsController(),
  ) {
    this.buildRoutes();
  }

  private buildRoutes(): void {
    RouteHelper.buildRoute(
      this.router,
      { baseRoute: MyBlanketsBuilder.BASE_ROUTE, route: "/" },
      RouteType.PRIVATE,
      Method.GET,
      this.controller.getMyBlankets.bind(this.controller),
    );
    RouteHelper.buildRoute(
      this.router,
      { baseRoute: MyBlanketsBuilder.BASE_ROUTE, route: "/" },
      RouteType.PRIVATE,
      Method.POST,
      this.controller.postMyBlankets.bind(this.controller),
    );
    RouteHelper.buildRoute(
      this.router,
      { baseRoute: MyBlanketsBuilder.BASE_ROUTE, route: "/:blanketId" },
      RouteType.PRIVATE,
      Method.GET,
      this.controller.getMyBlankets$.bind(this.controller),
    );
    RouteHelper.buildRoute(
      this.router,
      { baseRoute: MyBlanketsBuilder.BASE_ROUTE, route: "/:blanketId" },
      RouteType.PRIVATE,
      Method.PUT,
      this.controller.putMyBlankets$.bind(this.controller),
    );
    RouteHelper.buildRoute(
      this.router,
      { baseRoute: MyBlanketsBuilder.BASE_ROUTE, route: "/:blanketId" },
      RouteType.PRIVATE,
      Method.DELETE,
      this.controller.deleteMyBlankets$.bind(this.controller),
    );
  }
}
