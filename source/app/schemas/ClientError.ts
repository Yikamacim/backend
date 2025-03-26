import { AccountRules } from "../../common/rules/AccountRules";
import { AddressRules } from "../../common/rules/AddressRules";
import { SessionRules } from "../../common/rules/SessionRules";
import { VerificationRules } from "../../common/rules/VerificationRules";
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
  INVALID_PHONE_LENGTH = 60000,
  INVALID_PASSWORD_LENGTH = 60001,
  INVALID_NAME_LENGTH = 60002,
  INVALID_SURNAME_LENGTH = 60003,
  INVALID_CODE_LENGTH = 60004,
  INVALID_ADDRESS_NAME_LENGTH = 60005,
  INVALID_EXPLICIT_ADDRESS_LENGTH = 60006,
  //  *  7XXXX: Content errors
  INVALID_PHONE_CONTENT = 70002,
  INVALID_PASSWORD_CONTENT = 70003,
  INVALID_NAME_CONTENT = 70004,
  INVALID_SURNAME_CONTENT = 70005,
  INVALID_CODE_CONTENT = 70006,
  INVALID_ADDRESS_NAME_CONTENT = 70007,
  INVALID_EXPLICIT_ADDRESS_CONTENT = 70008,

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
  //  *  *  803XX: /verify errors
  PHONE_ALREADY_VERIFIED = 80300,
  CODE_NOT_EXPIRED = 80301,
  CODE_EXPIRED = 80302,
  INVALID_CODE = 80303,
  //  *  *  804XX: /countries errors
  INVALID_COUNTRY_ID = 80400,
  NO_COUNTRY_FOUND = 80401,
  //  *  *  805XX: /districts errors
  INVALID_DISTRICT_ID = 80500,
  NO_DISTRICT_FOUND = 80501,
  //  *  *  806XX: /neighborhoods errors
  INVALID_NEIGHBORHOOD_ID = 80600,
  NO_NEIGHBORHOOD_FOUND = 80601,
  //  *  *  807XX: /provinces errors
  INVALID_PROVINCE_ID = 80700,
  NO_PROVINCE_FOUND = 80701,
  //  *  *  808XX: /my/addresses errors
  INVALID_ADDRESS_ID = 80800,
  ADDRESS_NOT_FOUND = 80801,
  CANNOT_DELETE_DEFAULT_ADDRESS = 80802,
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
  [ClientErrorCode.INVALID_PHONE_LENGTH]: `Provided phone wasn't in the length range of ${AccountRules.PHONE_MIN_LENGTH} to ${AccountRules.PHONE_MAX_LENGTH}.`,
  [ClientErrorCode.INVALID_PASSWORD_LENGTH]: `Provided password wasn't in the length range of ${AccountRules.PASSWORD_MIN_LENGTH} to ${AccountRules.PASSWORD_MAX_LENGTH}.`,
  [ClientErrorCode.INVALID_NAME_LENGTH]: `Provided name wasn't in the length range of ${AccountRules.NAME_MIN_LENGTH} to ${AccountRules.NAME_MAX_LENGTH}.`,
  [ClientErrorCode.INVALID_SURNAME_LENGTH]: `Provided surname wasn't in the length range of ${AccountRules.SURNAME_MIN_LENGTH} to ${AccountRules.SURNAME_MAX_LENGTH}.`,
  [ClientErrorCode.INVALID_CODE_LENGTH]: `Provided code's length wasn't ${VerificationRules.CODE_LENGTH}.`,
  [ClientErrorCode.INVALID_ADDRESS_NAME_LENGTH]: `Provided address name wasn't in the length range of ${AddressRules.NAME_MIN_LENGTH} to ${AddressRules.NAME_MAX_LENGTH}.`,
  [ClientErrorCode.INVALID_EXPLICIT_ADDRESS_LENGTH]: `Provided explicit address wasn't in the length range of ${AddressRules.EXPLICIT_ADDRESS_MIN_LENGTH} to ${AddressRules.EXPLICIT_ADDRESS_MAX_LENGTH}.`,
  //  *  7XXXX: Content errors
  [ClientErrorCode.INVALID_PHONE_CONTENT]: "Provided phone contained invalid characters.",
  [ClientErrorCode.INVALID_PASSWORD_CONTENT]:
    "Provided password didn't satisfy the requirements. A password must contain at least one lowercase letter, one uppercase letter, one digit and one special character.",
  [ClientErrorCode.INVALID_NAME_CONTENT]: "Provided name contained invalid characters.",
  [ClientErrorCode.INVALID_SURNAME_CONTENT]: "Provided surname contained invalid characters.",
  [ClientErrorCode.INVALID_CODE_CONTENT]: "Provided code contained invalid characters.",
  [ClientErrorCode.INVALID_ADDRESS_NAME_CONTENT]:
    "Provided address name contained invalid characters.",
  [ClientErrorCode.INVALID_EXPLICIT_ADDRESS_CONTENT]:
    "Provided explicit address contained invalid characters.",

  // REQUEST ERRORS (8XXXX - 9XXXX)
  //  *  8XXXX: Route errors
  //  *  *  800XX: /login errors
  [ClientErrorCode.NO_ACCOUNT_FOUND]: "No account was found with the provided phone.",
  [ClientErrorCode.INCORRECT_PASSWORD]: "Provided password was incorrect.",
  //  *  *  801XX: /signup errors
  [ClientErrorCode.ACCOUNT_ALREADY_EXISTS]: "An account already exists with the provided phone.",
  //  *  *  802XX: /my/sessions errors
  [ClientErrorCode.SESSION_NOT_FOUND]:
    "Account doesn't have a session with the provided session id.",
  [ClientErrorCode.CANNOT_DELETE_CURRENT_SESSION]:
    "Current session can't be deleted. Use logout instead.",
  //  *  *  803XX: /verify errors
  [ClientErrorCode.PHONE_ALREADY_VERIFIED]: "Provided phone is already verified.",
  [ClientErrorCode.CODE_NOT_EXPIRED]: "Code hasn't expired yet.",
  [ClientErrorCode.CODE_EXPIRED]: "Code has expired.",
  [ClientErrorCode.INVALID_CODE]: "Provided code was incorrect.",
  //  *  *  804XX: /address/countries errors
  [ClientErrorCode.INVALID_COUNTRY_ID]: "Provided country id was invalid.",
  [ClientErrorCode.NO_COUNTRY_FOUND]: "No country was found with the provided id.",
  //  *  *  805XX: /address/districts errors
  [ClientErrorCode.INVALID_DISTRICT_ID]: "Provided district id was invalid.",
  [ClientErrorCode.NO_DISTRICT_FOUND]: "No district was found with the provided id.",
  //  *  *  806XX: /address/neighborhoods errors
  [ClientErrorCode.INVALID_NEIGHBORHOOD_ID]: "Provided neighborhood id was invalid.",
  [ClientErrorCode.NO_NEIGHBORHOOD_FOUND]: "No neighborhood was found with the provided id.",
  //  *  *  807XX: /address/provinces errors
  [ClientErrorCode.INVALID_PROVINCE_ID]: "Provided province id was invalid.",
  [ClientErrorCode.NO_PROVINCE_FOUND]: "No province was found with the provided id.",
  //  *  *  808XX: /my/addresses errors
  [ClientErrorCode.INVALID_ADDRESS_ID]: "Provided address id was invalid.",
  [ClientErrorCode.ADDRESS_NOT_FOUND]: "Account doesn't have an address with the provided id.",
  [ClientErrorCode.CANNOT_DELETE_DEFAULT_ADDRESS]: "Default address can't be deleted.",
  //  *  9XXXX: Catch-all errors
  [ClientErrorCode.RESOURCE_NOT_FOUND]: "The requested resource couldn't be found.",
};
