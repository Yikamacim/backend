import { Router } from "express";
import { Method } from "../../app/enums/Method";
import { RouteType } from "../../app/enums/RouteType";
import { RouteHelper } from "../../app/helpers/RouteHelper";
import type { IBuilder } from "../../app/interfaces/IBuilder";
import { AccountsController } from "./AccountsController";

export class AccountsBuilder implements IBuilder {
  public static readonly BASE_ROUTE = "/accounts";

  public constructor(
    public readonly router = Router({ mergeParams: true }),
    private readonly controller = new AccountsController(),
  ) {
    this.buildRoutes();
  }

  private buildRoutes(): void {
    RouteHelper.buildRoute(
      this.router,
      { baseRoute: AccountsBuilder.BASE_ROUTE, route: "/:phone" },
      RouteType.PUBLIC,
      Method.GET,
      this.controller.getAccount.bind(this.controller),
    );
  }
}
