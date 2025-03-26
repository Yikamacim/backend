import { Router } from "express";
import { Method } from "../../app/enums/Method";
import { RouteType } from "../../app/enums/RouteType";
import { RouteHelper } from "../../app/helpers/RouteHelper";
import type { IBuilder } from "../../app/interfaces/IBuilder";
import { LogoutController } from "./LogoutController";

export class LogoutBuilder implements IBuilder {
  public static readonly BASE_ROUTE = "/logout";

  public constructor(
    public readonly router = Router(),
    private readonly controller = new LogoutController(),
  ) {
    this.buildRoutes();
  }

  private buildRoutes(): void {
    RouteHelper.buildRoute(
      this.router,
      { baseRoute: LogoutBuilder.BASE_ROUTE, route: "/" },
      RouteType.PRIVATE,
      Method.DELETE,
      this.controller.postLogin.bind(this.controller),
    );
  }
}
