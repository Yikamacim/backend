import type { IncomingHttpHeaders } from "http";
import type { ParserResponse } from "../../@types/responses";
import type { ExpressRequest } from "../../@types/wrappers";
import { AuthValidator } from "../../common/validators/AuthValidator";
import type { IUtil } from "../interfaces/IUtil";
import { ClientError, ClientErrorCode } from "../schemas/ClientError";
import { ProtoUtil } from "./ProtoUtil";
import { ResponseUtil } from "./ResponseUtil";

export class HeadersUtil implements IUtil {
  public static parseToken(req: ExpressRequest): ParserResponse<string | null> {
    const preliminaryData: unknown = req.headers;
    // >----------< EXISTENCE VALIDATION >----------<
    if (!ProtoUtil.isProtovalid(preliminaryData)) {
      return ResponseUtil.parserResponse([new ClientError(ClientErrorCode.MISSING_HEADERS)], null);
    }
    const protovalidData: unknown = preliminaryData;
    // >----------< SCHEMATIC VALIDATION >----------<
    if (!HeadersUtil.isBlueprint(protovalidData, "authorization", "string")) {
      return ResponseUtil.parserResponse([new ClientError(ClientErrorCode.INVALID_HEADERS)], null);
    }
    const blueprintData: string = protovalidData.authorization!;
    // >----------< PHYSICAL VALIDATION >----------<
    const clientErrors: ClientError[] = [];
    AuthValidator.validate(blueprintData, clientErrors);
    const validatedData = blueprintData.split(" ")[1]!;
    // >----------< RETURN >----------<
    return ResponseUtil.parserResponse(clientErrors, validatedData);
  }

  private static isBlueprint(
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
}
