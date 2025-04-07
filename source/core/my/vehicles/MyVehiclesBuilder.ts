import { Router } from "express";
import { Method } from "../../../app/enums/Method";
import { RouteType } from "../../../app/enums/RouteType";
import { RouteHelper } from "../../../app/helpers/RouteHelper";
import type { IBuilder } from "../../../app/interfaces/IBuilder";
import { MyVehiclesController } from "./MyVehiclesController";

export class MyVehiclesBuilder implements IBuilder {
  public static readonly BASE_ROUTE = "/my/vehicles";

  public constructor(
    public readonly router = Router(),
    private readonly controller = new MyVehiclesController(),
  ) {
    this.buildRoutes();
  }

  private buildRoutes(): void {
    RouteHelper.buildRoute(
      this.router,
      { baseRoute: MyVehiclesBuilder.BASE_ROUTE, route: "/" },
      RouteType.PRIVATE,
      Method.GET,
      this.controller.getMyVehicles.bind(this.controller),
    );
    RouteHelper.buildRoute(
      this.router,
      { baseRoute: MyVehiclesBuilder.BASE_ROUTE, route: "/" },
      RouteType.PRIVATE,
      Method.POST,
      this.controller.postMyVehicles.bind(this.controller),
    );
    RouteHelper.buildRoute(
      this.router,
      { baseRoute: MyVehiclesBuilder.BASE_ROUTE, route: "/:vehicleId" },
      RouteType.PRIVATE,
      Method.GET,
      this.controller.getMyVehicles$.bind(this.controller),
    );
    RouteHelper.buildRoute(
      this.router,
      { baseRoute: MyVehiclesBuilder.BASE_ROUTE, route: "/:vehicleId" },
      RouteType.PRIVATE,
      Method.PUT,
      this.controller.putMyVehicles$.bind(this.controller),
    );
    RouteHelper.buildRoute(
      this.router,
      { baseRoute: MyVehiclesBuilder.BASE_ROUTE, route: "/:vehicleId" },
      RouteType.PRIVATE,
      Method.DELETE,
      this.controller.deleteMyVehicles$.bind(this.controller),
    );
  }
}
