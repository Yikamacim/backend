import pg from "pg";
import { EnvironmentHelper } from "../helpers/EnvironmentHelper";
import type { IConstants } from "../interfaces/IConstants";

export class DbConstants implements IConstants {
  public static readonly POOL = new pg.Pool({
    user: EnvironmentHelper.get().poolUser,
    host: EnvironmentHelper.get().poolHost,
    database: EnvironmentHelper.get().poolDatabase,
    port: EnvironmentHelper.get().poolPort,
  });
  public static readonly BEGIN = "BEGIN";
  public static readonly COMMIT = "COMMIT";
  public static readonly ROLLBACK = "ROLLBACK";
}
