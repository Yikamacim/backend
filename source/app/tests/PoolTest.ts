import { DbConstants } from "../constants/DbConstants.ts";
import { ConsoleHelper } from "../helpers/ConsoleHelper.ts";
import type { ITest } from "../interfaces/ITest.ts";

export class PoolTest implements ITest {
  public static async run(): Promise<void> {
    await DbConstants.POOL.query(DbConstants.BEGIN);
    await DbConstants.POOL.query(DbConstants.ROLLBACK);
    ConsoleHelper.success("Pool test passed.");
  }
}
