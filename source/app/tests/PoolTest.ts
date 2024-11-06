import { DbConstants } from "../constants/DbConstants";
import { LogHelper } from "../helpers/LogHelper";
import type { ITest } from "../interfaces/ITest";

export class PoolTest implements ITest {
  public static async run(): Promise<void> {
    await DbConstants.POOL.query(DbConstants.BEGIN);
    await DbConstants.POOL.query(DbConstants.ROLLBACK);
    LogHelper.success("Pool test passed.");
  }
}
