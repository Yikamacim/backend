import { Router } from "express";
import { Method } from "../../app/enums/Method";
import { RouteType } from "../../app/enums/RouteType";
import { RouteHelper } from "../../app/helpers/RouteHelper";
import type { IBuilder } from "../../app/interfaces/IBuilder";
import { ProvincesController } from "./ProvincesController";

export class ProvincesBuilder implements IBuilder {
  public static readonly BASE_ROUTE = "provinces";

  public constructor(
    public readonly router = Router(),
    private readonly controller = new ProvincesController(),
  ) {
    this.buildRoutes();
  }

  private buildRoutes(): void {
    RouteHelper.buildRoute(
      this.router,
      { baseRoute: ProvincesBuilder.BASE_ROUTE, route: "/" },
      RouteType.PUBLIC,
      Method.GET,
      this.controller.getProvinces.bind(this.controller),
    );
    RouteHelper.buildRoute(
      this.router,
      { baseRoute: ProvincesBuilder.BASE_ROUTE, route: "/:provinceId" },
      RouteType.PUBLIC,
      Method.GET,
      this.controller.getProvinces$provinceId.bind(this.controller),
    );
  }
}
