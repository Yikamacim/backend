import { Router } from "express";
import { Method } from "../../app/enums/Method.ts";
import { RouteHelper } from "../../app/helpers/RouteHelper.ts";
import type { IBuilder } from "../../app/interfaces/IBuilder.ts";
import { SignupController } from "./SignupController.ts";

export class SignupBuilder implements IBuilder {
  public static readonly BASE_ROUTE: string = "signup";

  public readonly router: Router;

  private readonly mController: SignupController;

  constructor() {
    this.router = Router();
    this.mController = new SignupController();
    this.buildRoutes();
  }

  private buildRoutes(): void {
    RouteHelper.buildRoute(
      this.router,
      { baseRoute: SignupBuilder.BASE_ROUTE, route: "/" },
      Method.POST,
      this.mController.postSignup.bind(this.mController),
    );
  }
}