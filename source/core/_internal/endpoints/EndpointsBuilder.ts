import { Router } from "express";
import { Method } from "../../../app/enums/Method";
import { RouteType } from "../../../app/enums/RouteType";
import { RouteHelper } from "../../../app/helpers/RouteHelper";
import type { IBuilder } from "../../../app/interfaces/IBuilder";
import { _internalRoute } from "../_internalRoute";
import { EndpointsController } from "./EndpointsController";

export class EndpointsBuilder implements IBuilder {
  public static readonly BASE_ROUTE = `${_internalRoute.BASE_ROUTE}/endpoints`;

  public constructor(
    public readonly router = Router(),
    private readonly controller = new EndpointsController(),
  ) {
    this.buildRoutes();
  }

  private buildRoutes(): void {
    RouteHelper.buildRoute(
      this.router,
      { baseRoute: EndpointsBuilder.BASE_ROUTE, route: "/" },
      RouteType.INTERNAL,
      Method.GET,
      this.controller.getEndpoints.bind(this.controller),
    );
  }
}
