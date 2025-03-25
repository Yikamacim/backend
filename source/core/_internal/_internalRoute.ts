import type { IRoute } from "../../app/interfaces/IRoute";
import { ApiRoute } from "../ApiRoute";

export class _internalRoute implements IRoute {
  public static readonly BASE_ROUTE = `${ApiRoute.BASE_ROUTE}/_internal`;
}
