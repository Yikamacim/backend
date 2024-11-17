import type { IParams } from "../../../../app/interfaces/IParams";
import { ClientError, ClientErrorCode } from "../../../../app/schemas/ClientError";
import { StringUtil } from "../../../../app/utils/StringUtil";

export class MySessionsParams implements IParams {
  private constructor(public readonly sessionId: string) {}

  public static isBlueprint(data: unknown): data is MySessionsParams {
    if (typeof data !== "object" || data === null) {
      return false;
    }
    const blueprint = data as MySessionsParams;
    return typeof blueprint.sessionId === "string";
  }

  public static getValidationErrors(blueprintData: MySessionsParams): ClientError[] {
    const validationErrors = new Array<ClientError>();
    if (!StringUtil.isIntParsable(blueprintData.sessionId)) {
      validationErrors.push(new ClientError(ClientErrorCode.INVALID_SESSION_ID));
    }
    return validationErrors;
  }
}
