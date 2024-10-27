import { Router } from "express";
import { Method } from "../../app/enums/Method.ts";
import { RouteHelper } from "../../app/helpers/RouteHelper.ts";
import type { IBuilder } from "../../app/interfaces/IBuilder.ts";
import { EndpointsController } from "./EndpointsController.ts";

export class EndpointsBuilder implements IBuilder {
  public static readonly BASE_ROUTE: string = "endpoints";

  public readonly router: Router;

  private readonly mController: EndpointsController;

  constructor() {
    this.router = Router();
    this.mController = new EndpointsController();
    this.buildRoutes();
  }

  private buildRoutes(): void {
    RouteHelper.buildRoute(
      this.router,
      { baseRoute: EndpointsBuilder.BASE_ROUTE, route: "/" },
      Method.GET,
      this.mController.getEndpoints.bind(this.mController),
    );
  }
}
