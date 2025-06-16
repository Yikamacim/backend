import { Router } from "express";
import { Method } from "../../../app/enums/Method";
import { RouteType } from "../../../app/enums/RouteType";
import { RouteHelper } from "../../../app/helpers/RouteHelper";
import type { IBuilder } from "../../../app/interfaces/IBuilder";
import { TopBusinessesController } from "./TopBusinessesController";

export class TopBusinessesBuilder implements IBuilder {
  public static readonly BASE_ROUTE = "/top/businesses";

  public constructor(
    public readonly router = Router({ mergeParams: true }),
    private readonly controller = new TopBusinessesController(),
  ) {
    this.buildRoutes();
  }

  private buildRoutes(): void {
    RouteHelper.buildRoute(
      this.router,
      { baseRoute: TopBusinessesBuilder.BASE_ROUTE, route: "/:neighborhoodId" },
      RouteType.PUBLIC,
      Method.GET,
      this.controller.getTopBusinesses.bind(this.controller),
    );
  }
}
