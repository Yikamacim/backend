import { Router } from "express";
import { Method } from "../../app/enums/Method";
import { RouteHelper } from "../../app/helpers/RouteHelper";
import type { IBuilder } from "../../app/interfaces/IBuilder";
import { LoginController } from "./LoginController";

export class LoginBuilder implements IBuilder {
  public static readonly BASE_ROUTE = "login";

  public constructor(
    public readonly router = Router(),
    private readonly controller = new LoginController(),
  ) {
    this.buildRoutes();
  }

  private buildRoutes(): void {
    RouteHelper.buildRoute(
      this.router,
      { baseRoute: LoginBuilder.BASE_ROUTE, route: "/" },
      Method.POST,
      this.controller.postLogin.bind(this.controller),
    );
  }
}
