import { Router } from "express";
import { Method } from "../../app/enums/Method";
import { RouteType } from "../../app/enums/RouteType";
import { RouteHelper } from "../../app/helpers/RouteHelper";
import type { IBuilder } from "../../app/interfaces/IBuilder";
import { AreasController } from "./AreasController";

export class AreasBuilder implements IBuilder {
  public static readonly BASE_ROUTE = "/areas";

  public constructor(
    public readonly router = Router(),
    private readonly controller = new AreasController(),
  ) {
    this.buildRoutes();
  }

  private buildRoutes(): void {
    RouteHelper.buildRoute(
      this.router,
      { baseRoute: AreasBuilder.BASE_ROUTE, route: "/" },
      RouteType.PUBLIC,
      Method.GET,
      this.controller.getAreas.bind(this.controller),
    );
  }
}
