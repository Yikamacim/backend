import { Router } from "express";
import { Method } from "../../app/enums/Method.ts";
import { RouteHelper } from "../../app/helpers/RouteHelper.ts";
import type { IBuilder } from "../../app/interfaces/IBuilder.ts";
import { AccountsController } from "./AccountsController.ts";

export class AccountsBuilder implements IBuilder {
  public static readonly BASE_ROUTE: string = "accounts";

  public readonly router: Router;

  private readonly mController: AccountsController;

  constructor() {
    this.router = Router();
    this.mController = new AccountsController();
    this.buildRoutes();
  }

  private buildRoutes(): void {
    RouteHelper.buildRoute(
      this.router,
      { baseRoute: AccountsBuilder.BASE_ROUTE, route: "/:username" },
      Method.GET,
      this.mController.getAccount.bind(this.mController),
    );
  }
}
