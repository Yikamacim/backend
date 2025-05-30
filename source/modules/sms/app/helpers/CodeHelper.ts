import type { IHelper } from "../../../../app/interfaces/IHelper";
import type { Code } from "../../@types/code";

export class CodeHelper implements IHelper {
  public static generate(): Code {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
}
