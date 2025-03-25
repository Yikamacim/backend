import type { IRoute } from "../../app/interfaces/IRoute";
import { ApiRoute } from "../ApiRoute";

export class MyRoute implements IRoute {
  public static readonly BASE_ROUTE = `${ApiRoute.BASE_ROUTE}/my`;
}
