import type { ClientErrorCodeMap } from "../../@types/maps.d.ts";
import type { IResponse } from "../interfaces/IResponse.ts";
import { AccountRules } from "../rules/AccountRules.ts";
import { SessionRules } from "../rules/SessionRules.ts";

export class ClientError implements IResponse {
  public readonly code: number;
  public readonly message: string;

  constructor(clientErrorCode: ClientErrorCode) {
    this.code = clientErrorCode;
    this.message = clientErrorMessages[clientErrorCode];
  }
}

export enum ClientErrorCode {
  // CONTRACT ERRORS (1XXXX - 2XXXX)
  //  *  1XXXX: Schema errors
  //  *  *  100XX: Body errors
  MISSING_BODY = 10000,
  INVALID_BODY = 10001,
  //  *  *  101XX: Parameter errors
  MISSING_PARAMETER = 10100,
  INVALID_PARAMETER = 10101,
  //  *  *  102XX: Query errors
  MISSING_QUERY = 10200,
  INVALID_QUERY = 10201,
  //  *  2XXXX: Method errors
  METHOD_NOT_ALLOWED = 20000,

  // AUTHORIZATION ERRORS (3XXXX - 5XXXX)
  //  *  3XXXX: Token errors
  INVALID_TOKEN = 30000,
  EXPIRED_TOKEN = 30001,
  //  *  4XXXX: Session errors
  INVALID_SESSION_KEY_LENGTH = 40000,
  INVALID_SESSION_KEY_CONTENT = 40001,
  //  *  5XXXX: Permission errors
  FORBIDDEN_ACCESS = 50000,

  // VALIDATION ERRORS (6XXXX - 7XXXX)
  //  *  6XXXX: Length errors
  INVALID_USERNAME_LENGTH = 60000,
  INVALID_PASSWORD_LENGTH = 60001,
  //  *  7XXXX: Content errors
  INVALID_USERNAME_CONTENT = 70002,
  INVALID_PASSWORD_CONTENT = 70003,

  // REQUEST ERRORS (8XXXX - 9XXXX)
  //  *  8XXXX: Route errors
  //  *  *  800XX: /login errors
  NO_ACCOUNT_FOUND = 80004,
  INCORRECT_PASSWORD = 80005,
  //  *  *  801XX: /signup errors
  ACCOUNT_ALREADY_EXISTS = 80104,
  //  *  9XXXX: Catch-all errors
  RESOURCE_NOT_FOUND = 90000,
}

const clientErrorMessages: ClientErrorCodeMap<string> = {
  // CONTRACT ERRORS (1XXXX - 2XXXX)
  //  *  1XXXX: Schema errors
  //  *  *  100XX: Body errors
  [ClientErrorCode.MISSING_BODY]: "Request body was not provided.",
  [ClientErrorCode.INVALID_BODY]: "Provided request body was invalid.",
  //  *  *  101XX: Parameter errors
  [ClientErrorCode.MISSING_PARAMETER]: "Required parameter was not provided.",
  [ClientErrorCode.INVALID_PARAMETER]: "Provided parameter was invalid.",
  //  *  *  102XX: Query errors
  [ClientErrorCode.MISSING_QUERY]: "Required query was not provided.",
  [ClientErrorCode.INVALID_QUERY]: "Provided query was invalid.",
  //  *  2XXXX: Method errors
  [ClientErrorCode.METHOD_NOT_ALLOWED]: "Requested method is not allowed.",

  // AUTHORIZATION ERRORS (3XXXX - 5XXXX)
  //  *  3XXXX: Token errors
  [ClientErrorCode.INVALID_TOKEN]: "Provided token was invalid.",
  [ClientErrorCode.EXPIRED_TOKEN]: "Provided token has expired.",
  //  *  4XXXX: Session errors
  [ClientErrorCode.INVALID_SESSION_KEY_LENGTH]:
    `Provided session key wasn't in the length range of ${SessionRules.SESSION_KEY_MIN_LENGTH} to ${SessionRules.SESSION_KEY_MAX_LENGTH}.`,
  [ClientErrorCode.INVALID_SESSION_KEY_CONTENT]: "Provided session key was invalid.",
  //  *  5XXXX: Permission errors
  [ClientErrorCode.FORBIDDEN_ACCESS]:
    "Provided account type doesn't have the necessary permissions to access this resource.",

  // VALIDATION ERRORS (6XXXX - 7XXXX)
  //  *  6XXXX: Length errors
  [ClientErrorCode.INVALID_USERNAME_LENGTH]:
    `Provided username wasn't in the length range of ${AccountRules.USERNAME_MIN_LENGTH} to ${AccountRules.USERNAME_MAX_LENGTH}.`,
  [ClientErrorCode.INVALID_PASSWORD_LENGTH]:
    `Provided password wasn't in the length range of ${AccountRules.PASSWORD_MIN_LENGTH} to ${AccountRules.PASSWORD_MAX_LENGTH}.`,
  //  *  7XXXX: Content errors
  [ClientErrorCode.INVALID_USERNAME_CONTENT]: "Provided username contained invalid characters.",
  [ClientErrorCode.INVALID_PASSWORD_CONTENT]:
    "Provided password didn't satisfy the requirements. A password must contain at least one lowercase letter, one uppercase letter, one digit and one special character.",

  // REQUEST ERRORS (8XXXX - 9XXXX)
  //  *  8XXXX: Route errors
  //  *  *  800XX: /login errors
  [ClientErrorCode.NO_ACCOUNT_FOUND]: "No account was found with the provided username.",
  [ClientErrorCode.INCORRECT_PASSWORD]: "Provided password was incorrect.",
  //  *  *  801XX: /signup errors
  [ClientErrorCode.ACCOUNT_ALREADY_EXISTS]: "An account already exists with the provided username.",
  //  *  9XXXX: Catch-all errors
  [ClientErrorCode.RESOURCE_NOT_FOUND]: "The requested resource couldn't be found.",
};
