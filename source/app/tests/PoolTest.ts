import { DbConstants } from "../constants/DbConstants.ts";
import { LogHelper } from "../helpers/LogHelper.ts";
import type { ITest } from "../interfaces/ITest.ts";

export class PoolTest implements ITest {
  public static async run(): Promise<void> {
    await DbConstants.POOL.query(DbConstants.BEGIN);
    await DbConstants.POOL.query(DbConstants.ROLLBACK);
    LogHelper.success("Pool test passed.");
  }
}
