import { Router } from "express";
import { Method } from "../../../app/enums/Method";
import { RouteHelper } from "../../../app/helpers/RouteHelper";
import type { IBuilder } from "../../../app/interfaces/IBuilder";
import { RecordsController } from "./RecordsController";

export class RecordsBuilder implements IBuilder {
  public static readonly BASE_ROUTE = "_internal/records";

  public constructor(
    public readonly router = Router(),
    private readonly controller = new RecordsController(),
  ) {
    this.buildRoutes();
  }

  private buildRoutes(): void {
    RouteHelper.buildRoute(
      this.router,
      { baseRoute: RecordsBuilder.BASE_ROUTE, route: "/" },
      Method.GET,
      this.controller.getRecords.bind(this.controller),
    );
    RouteHelper.buildRoute(
      this.router,
      { baseRoute: RecordsBuilder.BASE_ROUTE, route: "/" },
      Method.DELETE,
      this.controller.deleteRecords.bind(this.controller),
    );
  }
}
