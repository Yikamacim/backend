import { Router } from "express";
import { Method } from "../../../app/enums/Method";
import { RouteType } from "../../../app/enums/RouteType";
import { RouteHelper } from "../../../app/helpers/RouteHelper";
import type { IBuilder } from "../../../app/interfaces/IBuilder";
import { MySofasController } from "./MySofasController";

export class MySofasBuilder implements IBuilder {
  public static readonly BASE_ROUTE = "/my/sofas";

  public constructor(
    public readonly router = Router(),
    private readonly controller = new MySofasController(),
  ) {
    this.buildRoutes();
  }

  private buildRoutes(): void {
    RouteHelper.buildRoute(
      this.router,
      { baseRoute: MySofasBuilder.BASE_ROUTE, route: "/" },
      RouteType.PRIVATE,
      Method.GET,
      this.controller.getMySofas.bind(this.controller),
    );
    RouteHelper.buildRoute(
      this.router,
      { baseRoute: MySofasBuilder.BASE_ROUTE, route: "/" },
      RouteType.PRIVATE,
      Method.POST,
      this.controller.postMySofas.bind(this.controller),
    );
    RouteHelper.buildRoute(
      this.router,
      { baseRoute: MySofasBuilder.BASE_ROUTE, route: "/:sofaId" },
      RouteType.PRIVATE,
      Method.GET,
      this.controller.getMySofas$.bind(this.controller),
    );
    RouteHelper.buildRoute(
      this.router,
      { baseRoute: MySofasBuilder.BASE_ROUTE, route: "/:sofaId" },
      RouteType.PRIVATE,
      Method.PUT,
      this.controller.putMySofas$.bind(this.controller),
    );
    RouteHelper.buildRoute(
      this.router,
      { baseRoute: MySofasBuilder.BASE_ROUTE, route: "/:sofaId" },
      RouteType.PRIVATE,
      Method.DELETE,
      this.controller.deleteMySofas$.bind(this.controller),
    );
  }
}
