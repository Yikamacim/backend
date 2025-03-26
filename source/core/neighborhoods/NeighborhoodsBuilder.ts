import { Router } from "express";
import { Method } from "../../app/enums/Method";
import { RouteType } from "../../app/enums/RouteType";
import { RouteHelper } from "../../app/helpers/RouteHelper";
import type { IBuilder } from "../../app/interfaces/IBuilder";
import { NeighborhoodsController } from "./NeighborhoodsController";

export class NeighborhoodsBuilder implements IBuilder {
  public static readonly BASE_ROUTE = "/neighborhoods";

  public constructor(
    public readonly router = Router(),
    private readonly controller = new NeighborhoodsController(),
  ) {
    this.buildRoutes();
  }

  private buildRoutes(): void {
    RouteHelper.buildRoute(
      this.router,
      { baseRoute: NeighborhoodsBuilder.BASE_ROUTE, route: "/" },
      RouteType.PUBLIC,
      Method.GET,
      this.controller.getNeighborhoods.bind(this.controller),
    );
    RouteHelper.buildRoute(
      this.router,
      { baseRoute: NeighborhoodsBuilder.BASE_ROUTE, route: "/:neighborhoodId" },
      RouteType.PUBLIC,
      Method.GET,
      this.controller.getNeighborhoods$neighborhoodId.bind(this.controller),
    );
  }
}
