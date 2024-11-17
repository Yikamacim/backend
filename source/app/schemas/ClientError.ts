import { AccountRules } from "../../common/rules/AccountRules";
import { SessionRules } from "../../common/rules/SessionRules";
import { AuthConstants } from "../constants/AuthConstants";
import type { IResponse } from "../interfaces/IResponse";

export class ClientError implements IResponse {
  public readonly code: number;
  public readonly message: string;

  public constructor(clientErrorCode: ClientErrorCode) {
    this.code = clientErrorCode;
    this.message = clientErrorMessages[clientErrorCode];
  }
}

export enum ClientErrorCode {
  // CONTRACT ERRORS (1XXXX - 2XXXX)
  //  *  1XXXX: Schema errors
  //  *  *  100XX: Header errors
  MISSING_HEADERS = 10000,
  INVALID_HEADERS = 10001,
  //  *  *  101XX: Body errors
  MISSING_BODY = 10100,
  INVALID_BODY = 10101,
  //  *  *  102XX: Parameter errors
  MISSING_PARAMETER = 10200,
  INVALID_PARAMETER = 10201,
  //  *  *  103XX: Query errors
  MISSING_QUERY = 10300,
  INVALID_QUERY = 10301,
  //  *  2XXXX: Address errors
  //  *  *  200XX: Method errors
  METHOD_NOT_ALLOWED = 20000,

  // AUTHORIZATION ERRORS (3XXXX - 5XXXX)
  //  *  3XXXX: Token errors
  INVALID_AUTHORIZATION_HEADER = 30000,
  INVALID_TOKEN = 30001,
  EXPIRED_TOKEN = 30002,
  //  *  4XXXX: Session errors
  INVALID_SESSION_ID = 40000,
  INVALID_SESSION_KEY_LENGTH = 40001,
  INVALID_SESSION_KEY_CONTENT = 40002,
  INVALID_DEVICE_NAME_LENGTH = 40003,
  INVALID_DEVICE_NAME_CONTENT = 40004,
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
  //  *  *  802XX: /my/sessions errors
  SESSION_NOT_FOUND = 80200,
  CANNOT_DELETE_CURRENT_SESSION = 80201,
  //  *  9XXXX: Catch-all errors
  RESOURCE_NOT_FOUND = 90000,
}

const clientErrorMessages: Record<ClientErrorCode, string> = {
  // CONTRACT ERRORS (1XXXX - 2XXXX)
  //  *  1XXXX: Schema errors
  //  *  *  100XX: Header errors
  [ClientErrorCode.MISSING_HEADERS]: "Request headers were not provided.",
  [ClientErrorCode.INVALID_HEADERS]: "Provided request headers were invalid.",
  //  *  *  101XX: Body errors
  [ClientErrorCode.MISSING_BODY]: "Request body was not provided.",
  [ClientErrorCode.INVALID_BODY]: "Provided request body was invalid.",
  //  *  *  102XX: Parameter errors
  [ClientErrorCode.MISSING_PARAMETER]: "Required parameter was not provided.",
  [ClientErrorCode.INVALID_PARAMETER]: "Provided parameter was invalid.",
  //  *  *  103XX: Query errors
  [ClientErrorCode.MISSING_QUERY]: "Required query was not provided.",
  [ClientErrorCode.INVALID_QUERY]: "Provided query was invalid.",
  //  *  2XXXX: Address errors
  //  *  *  200XX: Method errors
  [ClientErrorCode.METHOD_NOT_ALLOWED]: "Requested method is not allowed.",

  // AUTHORIZATION ERRORS (3XXXX - 5XXXX)
  //  *  3XXXX: Token errors
  [ClientErrorCode.INVALID_AUTHORIZATION_HEADER]: `Authorization header was invalid. It must be in the format '${AuthConstants.TOKEN_PREFIX}<token>'.`,
  [ClientErrorCode.INVALID_TOKEN]: "Provided token was invalid.",
  [ClientErrorCode.EXPIRED_TOKEN]: "Provided token has expired.",
  //  *  4XXXX: Session errors
  [ClientErrorCode.INVALID_SESSION_ID]: "Provided session id was invalid.",
  [ClientErrorCode.INVALID_SESSION_KEY_LENGTH]: `Provided session key wasn't in the length of ${SessionRules.SESSION_KEY_LENGTH}.`,
  [ClientErrorCode.INVALID_SESSION_KEY_CONTENT]: "Provided session key was invalid.",
  [ClientErrorCode.INVALID_DEVICE_NAME_LENGTH]: `Provided device name wasn't in the length range of ${SessionRules.DEVICE_NAME_MIN_LENGTH} to ${SessionRules.DEVICE_NAME_MAX_LENGTH}.`,
  [ClientErrorCode.INVALID_DEVICE_NAME_CONTENT]: "Provided device name was invalid.",
  //  *  5XXXX: Permission errors
  [ClientErrorCode.FORBIDDEN_ACCESS]:
    "Provided account type doesn't have the necessary permissions to access this resource.",

  // VALIDATION ERRORS (6XXXX - 7XXXX)
  //  *  6XXXX: Length errors
  [ClientErrorCode.INVALID_USERNAME_LENGTH]: `Provided username wasn't in the length range of ${AccountRules.USERNAME_MIN_LENGTH} to ${AccountRules.USERNAME_MAX_LENGTH}.`,
  [ClientErrorCode.INVALID_PASSWORD_LENGTH]: `Provided password wasn't in the length range of ${AccountRules.PASSWORD_MIN_LENGTH} to ${AccountRules.PASSWORD_MAX_LENGTH}.`,
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
  //  *  *  802XX: /my/sessions errors
  [ClientErrorCode.SESSION_NOT_FOUND]:
    "Account doesn't have a session with the provided session id.",
  [ClientErrorCode.CANNOT_DELETE_CURRENT_SESSION]:
    "Current session can't be deleted. Use logout instead.",
  //  *  9XXXX: Catch-all errors
  [ClientErrorCode.RESOURCE_NOT_FOUND]: "The requested resource couldn't be found.",
};
