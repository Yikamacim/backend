import { Router } from "express";
import { Method } from "../../../app/enums/Method";
import { RouteType } from "../../../app/enums/RouteType";
import { RouteHelper } from "../../../app/helpers/RouteHelper";
import type { IBuilder } from "../../../app/interfaces/IBuilder";
import { MyChairsController } from "./MyChairsController";

export class MyChairsBuilder implements IBuilder {
  public static readonly BASE_ROUTE = "/my/chairs";

  public constructor(
    public readonly router = Router(),
    private readonly controller = new MyChairsController(),
  ) {
    this.buildRoutes();
  }

  private buildRoutes(): void {
    RouteHelper.buildRoute(
      this.router,
      { baseRoute: MyChairsBuilder.BASE_ROUTE, route: "/" },
      RouteType.PRIVATE,
      Method.GET,
      this.controller.getMyChairs.bind(this.controller),
    );
    RouteHelper.buildRoute(
      this.router,
      { baseRoute: MyChairsBuilder.BASE_ROUTE, route: "/" },
      RouteType.PRIVATE,
      Method.POST,
      this.controller.postMyChairs.bind(this.controller),
    );
    RouteHelper.buildRoute(
      this.router,
      { baseRoute: MyChairsBuilder.BASE_ROUTE, route: "/:chairId" },
      RouteType.PRIVATE,
      Method.GET,
      this.controller.getMyChairs$.bind(this.controller),
    );
    RouteHelper.buildRoute(
      this.router,
      { baseRoute: MyChairsBuilder.BASE_ROUTE, route: "/:chairId" },
      RouteType.PRIVATE,
      Method.PUT,
      this.controller.putMyChairs$.bind(this.controller),
    );
    RouteHelper.buildRoute(
      this.router,
      { baseRoute: MyChairsBuilder.BASE_ROUTE, route: "/:chairId" },
      RouteType.PRIVATE,
      Method.DELETE,
      this.controller.deleteMyChairs$.bind(this.controller),
    );
  }
}
