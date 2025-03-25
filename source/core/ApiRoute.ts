import { ConfigConstants } from "../app/constants/ConfigConstants";
import type { IRoute } from "../app/interfaces/IRoute";

export class ApiRoute implements IRoute {
  public static readonly BASE_ROUTE = ConfigConstants.API_PREFIX;
}
