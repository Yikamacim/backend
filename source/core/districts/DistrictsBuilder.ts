import { Router } from "express";
import { Method } from "../../app/enums/Method";
import { RouteType } from "../../app/enums/RouteType";
import { RouteHelper } from "../../app/helpers/RouteHelper";
import type { IBuilder } from "../../app/interfaces/IBuilder";
import { ApiRoute } from "../ApiRoute";
import { DistrictsController } from "./DistrictsController";

export class DistrictsBuilder implements IBuilder {
  public static readonly BASE_ROUTE = `${ApiRoute.BASE_ROUTE}/districts`;

  public constructor(
    public readonly router = Router(),
    private readonly controller = new DistrictsController(),
  ) {
    this.buildRoutes();
  }

  private buildRoutes(): void {
    RouteHelper.buildRoute(
      this.router,
      { baseRoute: DistrictsBuilder.BASE_ROUTE, route: "/" },
      RouteType.PUBLIC,
      Method.GET,
      this.controller.getDistricts.bind(this.controller),
    );
    RouteHelper.buildRoute(
      this.router,
      { baseRoute: DistrictsBuilder.BASE_ROUTE, route: "/:districtId" },
      RouteType.PUBLIC,
      Method.GET,
      this.controller.getDistricts$districtId.bind(this.controller),
    );
  }
}
