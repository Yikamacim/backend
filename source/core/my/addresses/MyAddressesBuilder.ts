import { Router } from "express";
import { Method } from "../../../app/enums/Method";
import { RouteType } from "../../../app/enums/RouteType";
import { RouteHelper } from "../../../app/helpers/RouteHelper";
import type { IBuilder } from "../../../app/interfaces/IBuilder";
import { MyAddressesController } from "./MyAddressesController";

export class MyAddressesBuilder implements IBuilder {
  public static readonly BASE_ROUTE = "/my/addresses";

  public constructor(
    public readonly router = Router(),
    private readonly controller = new MyAddressesController(),
  ) {
    this.buildRoutes();
  }

  private buildRoutes(): void {
    RouteHelper.buildRoute(
      this.router,
      { baseRoute: MyAddressesBuilder.BASE_ROUTE, route: "/" },
      RouteType.PRIVATE,
      Method.GET,
      this.controller.getMyAddresses.bind(this.controller),
    );
    RouteHelper.buildRoute(
      this.router,
      { baseRoute: MyAddressesBuilder.BASE_ROUTE, route: "/" },
      RouteType.PRIVATE,
      Method.POST,
      this.controller.postMyAddresses.bind(this.controller),
    );
    RouteHelper.buildRoute(
      this.router,
      { baseRoute: MyAddressesBuilder.BASE_ROUTE, route: "/:addressId" },
      RouteType.PRIVATE,
      Method.GET,
      this.controller.getMyAddresses$addressId.bind(this.controller),
    );
    RouteHelper.buildRoute(
      this.router,
      { baseRoute: MyAddressesBuilder.BASE_ROUTE, route: "/:addressId" },
      RouteType.PRIVATE,
      Method.PUT,
      this.controller.putMyAddresses$addressId.bind(this.controller),
    );
    RouteHelper.buildRoute(
      this.router,
      { baseRoute: MyAddressesBuilder.BASE_ROUTE, route: "/:addressId" },
      RouteType.PRIVATE,
      Method.DELETE,
      this.controller.deleteMyAddresses$addressId.bind(this.controller),
    );
  }
}
