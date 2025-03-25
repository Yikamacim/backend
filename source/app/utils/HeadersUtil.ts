import type { IncomingHttpHeaders } from "http";
import type { ParserResponse } from "../../@types/responses";
import type { Token } from "../../@types/tokens";
import type { ExpressRequest } from "../../@types/wrappers";
import { AuthValidator } from "../../common/validators/AuthValidator";
import type { IUtil } from "../interfaces/IUtil";
import { ClientError, ClientErrorCode } from "../schemas/ClientError";
import { ProtoUtil } from "./ProtoUtil";
import { ResponseUtil } from "./ResponseUtil";

export class HeadersUtil implements IUtil {
  public static parseToken(req: ExpressRequest): ParserResponse<Token | null> {
    const preliminaryData: unknown = req.headers;
    // V1: Existence validation
    if (!ProtoUtil.isProtovalid(preliminaryData)) {
      return ResponseUtil.parserResponse([new ClientError(ClientErrorCode.MISSING_HEADERS)], null);
    }
    const protovalidData: unknown = preliminaryData;
    // V2: Schematic validation
    if (!HeadersUtil.isBlueprint(protovalidData, "authorization", "string")) {
      return ResponseUtil.parserResponse([new ClientError(ClientErrorCode.INVALID_HEADERS)], null);
    }
    const blueprintData: string = protovalidData.authorization!;
    // V3: Physical validation
    const clientErrors: ClientError[] = [];
    AuthValidator.validate(blueprintData, clientErrors);
    const validatedData: Token = blueprintData.split(" ")[1]!;
    // Return parser response
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
