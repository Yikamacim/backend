import { Router } from "express";
import { Method } from "../../app/enums/Method";
import { RouteType } from "../../app/enums/RouteType";
import { RouteHelper } from "../../app/helpers/RouteHelper";
import type { IBuilder } from "../../app/interfaces/IBuilder";
import { RefreshController } from "./RefreshController";

export class RefreshBuilder implements IBuilder {
  public static readonly BASE_ROUTE = "refresh";

  public constructor(
    public readonly router = Router(),
    private readonly controller = new RefreshController(),
  ) {
    this.buildRoutes();
  }

  private buildRoutes(): void {
    RouteHelper.buildRoute(
      this.router,
      { baseRoute: RefreshBuilder.BASE_ROUTE, route: "/" },
      RouteType.PRIVATE,
      Method.GET,
      this.controller.getRefresh.bind(this.controller),
    );
  }
}
