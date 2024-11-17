import { Router } from "express";
import { Method } from "../../../app/enums/Method";
import { RouteHelper } from "../../../app/helpers/RouteHelper";
import type { IBuilder } from "../../../app/interfaces/IBuilder";
import { MySessionsController } from "./MySessionsController";

export class MySessionsBuilder implements IBuilder {
  public static readonly BASE_ROUTE = "my/sessions";

  public constructor(
    public readonly router = Router(),
    private readonly controller = new MySessionsController(),
  ) {
    this.buildRoutes();
  }

  private buildRoutes(): void {
    RouteHelper.buildRoute(
      this.router,
      { baseRoute: MySessionsBuilder.BASE_ROUTE, route: "/" },
      Method.GET,
      this.controller.getMySessions.bind(this.controller),
    );
  }
}
