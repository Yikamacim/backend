import { Router } from "express";
import { Method } from "../../app/enums/Method";
import { RouteType } from "../../app/enums/RouteType";
import { RouteHelper } from "../../app/helpers/RouteHelper";
import type { IBuilder } from "../../app/interfaces/IBuilder";
import { SignupController } from "./SignupController";

export class SignupBuilder implements IBuilder {
  public static readonly BASE_ROUTE = "/signup";

  public constructor(
    public readonly router = Router(),
    private readonly controller = new SignupController(),
  ) {
    this.buildRoutes();
  }

  private buildRoutes(): void {
    RouteHelper.buildRoute(
      this.router,
      { baseRoute: SignupBuilder.BASE_ROUTE, route: "/" },
      RouteType.AUTHENTICATING,
      Method.POST,
      this.controller.postSignup.bind(this.controller),
    );
  }
}
