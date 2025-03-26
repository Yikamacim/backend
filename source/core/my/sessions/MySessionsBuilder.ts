import { Router } from "express";
import { Method } from "../../../app/enums/Method";
import { RouteType } from "../../../app/enums/RouteType";
import { RouteHelper } from "../../../app/helpers/RouteHelper";
import type { IBuilder } from "../../../app/interfaces/IBuilder";
import { MySessionsController } from "./MySessionsController";

export class MySessionsBuilder implements IBuilder {
  public static readonly BASE_ROUTE = "/my/sessions";

  public constructor(
    public readonly router = Router(),
    private readonly controller = new MySessionsController(),
  ) {
    this.buildRoutes();
  }

  private buildRoutes(): void {
    RouteHelper.buildRoute(
      this.router,
      { baseRoute: MySessionsBuilder.BASE_ROUTE, route: "/" },
      RouteType.PRIVATE,
      Method.GET,
      this.controller.getMySessions.bind(this.controller),
    );
    RouteHelper.buildRoute(
      this.router,
      { baseRoute: MySessionsBuilder.BASE_ROUTE, route: "/:sessionId" },
      RouteType.PRIVATE,
      Method.DELETE,
      this.controller.deleteMySessions$sessionId.bind(this.controller),
    );
  }
}
