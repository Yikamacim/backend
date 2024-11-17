import { Router } from "express";
import { Method } from "../../app/enums/Method";
import { RouteHelper } from "../../app/helpers/RouteHelper";
import type { IBuilder } from "../../app/interfaces/IBuilder";
import { AccountsController } from "./AccountsController";

export class AccountsBuilder implements IBuilder {
  public static readonly BASE_ROUTE = "accounts";

  public constructor(
    public readonly router = Router(),
    private readonly controller = new AccountsController(),
  ) {
    this.buildRoutes();
  }

  private buildRoutes(): void {
    RouteHelper.buildRoute(
      this.router,
      { baseRoute: AccountsBuilder.BASE_ROUTE, route: "/:username" },
      Method.GET,
      this.controller.getAccount.bind(this.controller),
    );
  }
}
