import { Router } from "express";
import { Method } from "../../../app/enums/Method";
import { RouteType } from "../../../app/enums/RouteType";
import { RouteHelper } from "../../../app/helpers/RouteHelper";
import type { IBuilder } from "../../../app/interfaces/IBuilder";
import { PurgeController } from "./PurgeController";

export class PurgeBuilder implements IBuilder {
  public static readonly BASE_ROUTE = "/_internal/purge";

  public constructor(
    public readonly router = Router(),
    private readonly controller = new PurgeController(),
  ) {
    this.buildRoutes();
  }

  private buildRoutes(): void {
    RouteHelper.buildRoute(
      this.router,
      { baseRoute: PurgeBuilder.BASE_ROUTE, route: "/" },
      RouteType.INTERNAL,
      Method.DELETE,
      this.controller.deletePurge.bind(this.controller),
    );
  }
}
