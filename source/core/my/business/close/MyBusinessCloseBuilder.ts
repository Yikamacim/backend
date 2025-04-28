import { Router } from "express";
import { Method } from "../../../../app/enums/Method";
import { RouteType } from "../../../../app/enums/RouteType";
import { RouteHelper } from "../../../../app/helpers/RouteHelper";
import type { IBuilder } from "../../../../app/interfaces/IBuilder";
import { MyBusinessCloseController } from "./MyBusinessCloseController";

export class MyBusinessCloseBuilder implements IBuilder {
  public static readonly BASE_ROUTE = "/my/business/close";

  public constructor(
    public readonly router = Router(),
    private readonly controller = new MyBusinessCloseController(),
  ) {
    this.buildRoutes();
  }

  private buildRoutes(): void {
    RouteHelper.buildRoute(
      this.router,
      { baseRoute: MyBusinessCloseBuilder.BASE_ROUTE, route: "/" },
      RouteType.PRIVATE,
      Method.PUT,
      this.controller.putMyBusinessClose.bind(this.controller),
    );
  }
}
