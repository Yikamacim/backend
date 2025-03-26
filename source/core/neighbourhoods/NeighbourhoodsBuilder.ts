import { Router } from "express";
import { Method } from "../../app/enums/Method";
import { RouteType } from "../../app/enums/RouteType";
import { RouteHelper } from "../../app/helpers/RouteHelper";
import type { IBuilder } from "../../app/interfaces/IBuilder";
import { ApiRoute } from "../ApiRoute";
import { NeighbourhoodsController } from "./NeighbourhoodsController";

export class NeighbourhoodsBuilder implements IBuilder {
  public static readonly BASE_ROUTE = `${ApiRoute.BASE_ROUTE}/neighbourhoods`;

  public constructor(
    public readonly router = Router(),
    private readonly controller = new NeighbourhoodsController(),
  ) {
    this.buildRoutes();
  }

  private buildRoutes(): void {
    RouteHelper.buildRoute(
      this.router,
      { baseRoute: NeighbourhoodsBuilder.BASE_ROUTE, route: "/" },
      RouteType.PUBLIC,
      Method.GET,
      this.controller.getNeighbourhoods.bind(this.controller),
    );
    RouteHelper.buildRoute(
      this.router,
      { baseRoute: NeighbourhoodsBuilder.BASE_ROUTE, route: "/:neighbourhoodId" },
      RouteType.PUBLIC,
      Method.GET,
      this.controller.getNeighbourhoods$neighbourhoodId.bind(this.controller),
    );
  }
}
