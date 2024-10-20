import { Router } from "express";
import { Method } from "../../app/enums/Method.ts";
import { RouteHelper } from "../../app/helpers/RouteHelper.ts";
import type { IBuilder } from "../../app/interfaces/IBuilder.ts";
import { LoginController } from "./LoginController.ts";

export class LoginBuilder implements IBuilder {
  public static readonly BASE_ROUTE: string = "login";

  public readonly router: Router;

  private readonly mController: LoginController;

  constructor() {
    this.router = Router();
    this.mController = new LoginController();
    this.buildRoutes();
  }

  private buildRoutes(): void {
    RouteHelper.buildRoute(
      this.router,
      { baseRoute: LoginBuilder.BASE_ROUTE, route: "/" },
      Method.POST,
      this.mController.postLogin.bind(this.mController),
    );
  }
}
