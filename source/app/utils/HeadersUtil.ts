import type { IncomingHttpHeaders } from "http";
import { AuthValidator } from "../../common/validators/AuthValidator";
import type { IUtil } from "../interfaces/IUtil";
import type { ClientError } from "../schemas/ClientError";

export class HeadersUtil implements IUtil {
  public static isBlueprint(
    obj: unknown,
    key: string,
    type: "string" | "string[]",
  ): obj is IncomingHttpHeaders {
    if (typeof obj !== "object" || obj === null) {
      return false;
    }
    if (
      !Object.entries(obj).every(([key, value]) => {
        if (typeof key !== "string") {
          return false;
        }
        return (
          value === undefined ||
          typeof value === "string" ||
          (Array.isArray(value) && value.every((item) => typeof item === "string"))
        );
      })
    ) {
      return false;
    }
    const blueprint: IncomingHttpHeaders = obj as IncomingHttpHeaders;
    if (!(key.toLowerCase() in blueprint)) {
      return false;
    }
    if (blueprint[key.toLowerCase()] === undefined) {
      return false;
    }
    if (type === "string") {
      return typeof blueprint[key.toLowerCase()] === "string";
    }
    if (type === "string[]") {
      return Array.isArray(blueprint[key.toLowerCase()]);
    }
    return true;
  }

  public static getAuthValidationErrors(blueprintData: string): ClientError[] {
    const validationErrors: ClientError[] = new Array<ClientError>();
    AuthValidator.validate(blueprintData, validationErrors);
    return validationErrors;
  }
}
