import { Router } from "express";
import { Method } from "../../app/enums/Method";
import { RouteType } from "../../app/enums/RouteType";
import { RouteHelper } from "../../app/helpers/RouteHelper";
import type { IBuilder } from "../../app/interfaces/IBuilder";
import { VerifyController } from "./VerifyController";

export class VerifyBuilder implements IBuilder {
  public static readonly BASE_ROUTE = "verify";

  public constructor(
    public readonly router = Router(),
    private readonly controller = new VerifyController(),
  ) {
    this.buildRoutes();
  }

  private buildRoutes(): void {
    RouteHelper.buildRoute(
      this.router,
      { baseRoute: VerifyBuilder.BASE_ROUTE, route: "/" },
      RouteType.AUTHENTICATING,
      Method.POST,
      this.controller.postVerify.bind(this.controller),
    );
  }
}
