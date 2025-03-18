import { Router } from "express";
import { Method } from "../../app/enums/Method";
import { RouteType } from "../../app/enums/RouteType";
import { RouteHelper } from "../../app/helpers/RouteHelper";
import type { IBuilder } from "../../app/interfaces/IBuilder";
import { AccessController } from "./AccessController";

export class AccessBuilder implements IBuilder {
  public static readonly BASE_ROUTE = "access";

  public constructor(
    public readonly router = Router(),
    private readonly controller = new AccessController(),
  ) {
    this.buildRoutes();
  }

  private buildRoutes(): void {
    RouteHelper.buildRoute(
      this.router,
      { baseRoute: AccessBuilder.BASE_ROUTE, route: "/" },
      RouteType.PRIVATE,
      Method.GET,
      this.controller.getAccess.bind(this.controller),
    );
  }
}
