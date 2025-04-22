import { AccountRules } from "../../common/rules/AccountRules";
import { AddressRules } from "../../common/rules/AddressRules";
import { BankRules } from "../../common/rules/BankRules";
import { BusinessRules } from "../../common/rules/BusinessRules";
import { ChairRules } from "../../common/rules/ChairRules";
import { ContactRules } from "../../common/rules/ContactRules";
import { ItemRules } from "../../common/rules/ItemRules";
import { SessionRules } from "../../common/rules/SessionRules";
import { VehicleRules } from "../../common/rules/VehicleRules";
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
  INVALID_ITEM_NAME_LENGTH = 60007,
  INVALID_ITEM_DESCRIPTION_LENGTH = 60008,
  INVALID_VEHICLE_BRAND_LENGTH = 60009,
  INVALID_VEHICLE_MODEL_LENGTH = 60010,
  INVALID_EMAIL_LENGTH = 60011,
  INVALID_BUSINESS_NAME_LENGTH = 60012,
  INVALID_BUSINESS_DESCRIPTION_LENGTH = 60013,
  INVALID_BUSINESS_HOUR_LENGTH = 60014,
  INVALID_IBAN_LENGTH = 60015,
  INVALIDD_OWNER_LENGTH = 60016,
  //  *  7XXXX: Content errors
  INVALID_PHONE_CONTENT = 70002,
  INVALID_PASSWORD_CONTENT = 70003,
  INVALID_NAME_CONTENT = 70004,
  INVALID_SURNAME_CONTENT = 70005,
  INVALID_CODE_CONTENT = 70006,
  INVALID_ADDRESS_NAME_CONTENT = 70007,
  INVALID_EXPLICIT_ADDRESS_CONTENT = 70008,
  INVALID_ITEM_NAME_CONTENT = 70009,
  INVALID_ITEM_DESCRIPTION_CONTENT = 70010,
  DUPLICATE_MEDIA_IDS = 70011,
  MEDIA_TYPE_NOT_ALLOWED = 70012,
  INVALID_VEHICLE_BRAND_CONTENT = 70013,
  INVALID_VEHICLE_MODEL_CONTENT = 70014,
  INVALID_CHAIR_QUANTITY = 70015,
  INVALID_EMAIL_CONTENT = 70016,
  INVALID_BUSINESS_NAME_CONTENT = 70017,
  INVALID_BUSINESS_DESCRIPTION_CONTENT = 70018,
  INVALID_BUSINESS_HOUR_CONTENT = 70019,
  INVALID_IBAN_CONTENT = 70020,
  INVALID_OWNER_CONTENT = 70021,

  // REQUEST ERRORS (8XXXX - 9XXXX)
  //  *  8XXXX: Route errors
  //  *  *  800XX: /login errors
  ACCOUNT_NOT_FOUND = 80004,
  INCORRECT_PASSWORD = 80005,
  //  *  *  801XX: /signup errors
  ACCOUNT_ALREADY_EXISTS = 80104,
  //  *  *  802XX: /my/sessions errors
  SESSION_NOT_FOUND = 80200,
  CANNOT_DELETE_CURRENT_SESSION = 80201,
  //  *  *  803XX: /verify errors
  PHONE_ALREADY_VERIFIED = 80300,
  CODE_NOT_EXPIRED = 80301,
  NO_VERIFICATION_FOUND = 80302,
  CODE_EXPIRED = 80303,
  INVALID_CODE = 80304,
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
  //  *  *  809XX: /my/medias errors
  INVALID_MEDIA_TYPE = 80900,
  //  *  *  810XX: /my/carpets errors
  INVALID_CARPET_ID = 81000,
  CARPET_NOT_FOUND = 81001,
  MEDIA_NOT_FOUND = 81002,
  MEDIA_NOT_UPLOADED = 81004,
  //  *  *  811XX: /my/vehicles errors
  INVALID_VEHICLE_ID = 81100,
  VEHICLE_NOT_FOUND = 81101,
  //  *  *  812XX: /my/curtains errors
  INVALID_CURTAIN_ID = 81200,
  CURTAIN_NOT_FOUND = 81201,
  //  *  *  813XX: /my/beds errors
  INVALID_BED_ID = 81300,
  BED_NOT_FOUND = 81301,
  //  *  *  814XX: /my/sofas errors
  INVALID_SOFA_ID = 81400,
  SOFA_NOT_FOUND = 81401,
  //  *  *  815XX: /my/chairs errors
  INVALID_CHAIR_ID = 81500,
  CHAIR_NOT_FOUND = 81501,
  //  *  *  816XX: /my/quilts errors
  INVALID_QUILT_ID = 81600,
  QUILT_NOT_FOUND = 81601,
  //  *  *  817XX: /my/blankets errors
  INVALID_BLANKET_ID = 81700,
  BLANKET_NOT_FOUND = 81701,
  //  *  *  818XX: /my/business errors
  BUSINESS_NOT_FOUND = 81800,
  BUSINESS_ALREADY_EXISTS = 81801,
  BUSINESS_IS_OPEN = 81802,
  //  *  *  819XX: /my/business/hours errors
  BUSINESS_HOURS_NOT_FOUND = 81900,
  BUSINESS_HOURS_ALREADY_EXISTS = 81901,
  //  *  *  820XX: /my/business/bank errors
  BANK_NOT_FOUND = 82000,
  BANK_ALREADY_EXISTS = 82001,
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
  [ClientErrorCode.INVALID_PHONE_LENGTH]: `Provided phone wasn't in the length range of ${ContactRules.PHONE_MIN_LENGTH} to ${ContactRules.PHONE_MAX_LENGTH}.`,
  [ClientErrorCode.INVALID_PASSWORD_LENGTH]: `Provided password wasn't in the length range of ${AccountRules.PASSWORD_MIN_LENGTH} to ${AccountRules.PASSWORD_MAX_LENGTH}.`,
  [ClientErrorCode.INVALID_NAME_LENGTH]: `Provided name wasn't in the length range of ${AccountRules.NAME_MIN_LENGTH} to ${AccountRules.NAME_MAX_LENGTH}.`,
  [ClientErrorCode.INVALID_SURNAME_LENGTH]: `Provided surname wasn't in the length range of ${AccountRules.SURNAME_MIN_LENGTH} to ${AccountRules.SURNAME_MAX_LENGTH}.`,
  [ClientErrorCode.INVALID_CODE_LENGTH]: `Provided code's length wasn't ${VerificationRules.CODE_LENGTH}.`,
  [ClientErrorCode.INVALID_ADDRESS_NAME_LENGTH]: `Provided address name wasn't in the length range of ${AddressRules.NAME_MIN_LENGTH} to ${AddressRules.NAME_MAX_LENGTH}.`,
  [ClientErrorCode.INVALID_EXPLICIT_ADDRESS_LENGTH]: `Provided explicit address wasn't in the length range of ${AddressRules.EXPLICIT_ADDRESS_MIN_LENGTH} to ${AddressRules.EXPLICIT_ADDRESS_MAX_LENGTH}.`,
  [ClientErrorCode.INVALID_ITEM_NAME_LENGTH]: `Provided item name wasn't in the length range of ${ItemRules.NAME_MIN_LENGTH} to ${ItemRules.NAME_MAX_LENGTH}.`,
  [ClientErrorCode.INVALID_ITEM_DESCRIPTION_LENGTH]: `Provided item description wasn't in the length range of ${ItemRules.DESCRIPTION_MIN_LENGTH} to ${ItemRules.DESCRIPTION_MAX_LENGTH}.`,
  [ClientErrorCode.INVALID_VEHICLE_BRAND_LENGTH]: `Provided vehicle brand wasn't in the length range of ${VehicleRules.BRAND_MIN_LENGTH} to ${VehicleRules.BRAND_MAX_LENGTH}.`,
  [ClientErrorCode.INVALID_VEHICLE_MODEL_LENGTH]: `Provided vehicle model wasn't in the length range of ${VehicleRules.MODEL_MIN_LENGTH} to ${VehicleRules.MODEL_MAX_LENGTH}.`,
  [ClientErrorCode.INVALID_EMAIL_LENGTH]: `Provided email wasn't in the length range of ${ContactRules.EMAIL_MIN_LENGTH} to ${ContactRules.EMAIL_MAX_LENGTH}.`,
  [ClientErrorCode.INVALID_BUSINESS_NAME_LENGTH]: `Provided business name wasn't in the length range of ${BusinessRules.NAME_MIN_LENGTH} to ${BusinessRules.NAME_MAX_LENGTH}.`,
  [ClientErrorCode.INVALID_BUSINESS_DESCRIPTION_LENGTH]: `Provided business description wasn't in the length range of ${BusinessRules.DESCRIPTION_MIN_LENGTH} to ${BusinessRules.DESCRIPTION_MAX_LENGTH}.`,
  [ClientErrorCode.INVALID_BUSINESS_HOUR_LENGTH]: `Provided business hour wasn't in the length of ${BusinessRules.HOUR_LENGTH}.`,
  [ClientErrorCode.INVALID_IBAN_LENGTH]: `Provided IBAN wasn't in the length range of ${BankRules.IBAN_MIN_LENGTH} to ${BankRules.IBAN_MAX_LENGTH}.`,
  [ClientErrorCode.INVALIDD_OWNER_LENGTH]: `Provided bank owner wasn't in the length range of ${BankRules.OWNER_MIN_LENGTH} to ${BankRules.OWNER_MAX_LENGTH}.`,
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
  [ClientErrorCode.INVALID_ITEM_NAME_CONTENT]: "Provided item name contained invalid characters.",
  [ClientErrorCode.INVALID_ITEM_DESCRIPTION_CONTENT]:
    "Provided item description contained invalid characters.",
  [ClientErrorCode.DUPLICATE_MEDIA_IDS]: "Provided media ids contained duplicates.",
  [ClientErrorCode.MEDIA_TYPE_NOT_ALLOWED]: `Provided media type wasn't in the allowed types.`,
  [ClientErrorCode.INVALID_VEHICLE_BRAND_CONTENT]:
    "Provided vehicle brand contained invalid characters.",
  [ClientErrorCode.INVALID_VEHICLE_MODEL_CONTENT]:
    "Provided vehicle model contained invalid characters.",
  [ClientErrorCode.INVALID_CHAIR_QUANTITY]: `Provided chair quantity wasn't in the range of ${ChairRules.QUANTITY_MIN} to ${ChairRules.QUANTITY_MAX}.`,
  [ClientErrorCode.INVALID_EMAIL_CONTENT]: "Provided email contained invalid characters.",
  [ClientErrorCode.INVALID_BUSINESS_NAME_CONTENT]:
    "Provided business name contained invalid characters.",
  [ClientErrorCode.INVALID_BUSINESS_DESCRIPTION_CONTENT]:
    "Provided business description contained invalid characters.",
  [ClientErrorCode.INVALID_BUSINESS_HOUR_CONTENT]:
    "Provided business hour contained invalid characters.",
  [ClientErrorCode.INVALID_IBAN_CONTENT]: "Provided IBAN contained invalid characters.",
  [ClientErrorCode.INVALID_OWNER_CONTENT]: "Provided bank owner contained invalid characters.",

  // REQUEST ERRORS (8XXXX - 9XXXX)
  //  *  8XXXX: Route errors
  //  *  *  800XX: /login errors
  [ClientErrorCode.ACCOUNT_NOT_FOUND]: "No account was found with the provided phone.",
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
  [ClientErrorCode.NO_VERIFICATION_FOUND]: "No verification was found with the provided phone.",
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
  //  *  *  809XX: /my/medias errors
  [ClientErrorCode.INVALID_MEDIA_TYPE]: "Provided media type was invalid.",
  //  *  *  810XX: /my/carpets errors
  [ClientErrorCode.INVALID_CARPET_ID]: "Provided carpet id was invalid.",
  [ClientErrorCode.CARPET_NOT_FOUND]: "Account doesn't have a carpet with the provided id.",
  [ClientErrorCode.MEDIA_NOT_FOUND]: "Account doesn't have a media with the provided id.",
  [ClientErrorCode.MEDIA_NOT_UPLOADED]: "Media wasn't uploaded to the bucket.",
  //  *  *  811XX: /my/vehicles errors
  [ClientErrorCode.INVALID_VEHICLE_ID]: "Provided vehicle id was invalid.",
  [ClientErrorCode.VEHICLE_NOT_FOUND]: "Account doesn't have a vehicle with the provided id.",
  //  *  *  812XX: /my/curtains errors
  [ClientErrorCode.INVALID_CURTAIN_ID]: "Provided curtain id was invalid.",
  [ClientErrorCode.CURTAIN_NOT_FOUND]: "Account doesn't have a curtain with the provided id.",
  //  *  *  813XX: /my/beds errors
  [ClientErrorCode.INVALID_BED_ID]: "Provided bed id was invalid.",
  [ClientErrorCode.BED_NOT_FOUND]: "Account doesn't have a bed with the provided id.",
  //  *  *  814XX: /my/sofas errors
  [ClientErrorCode.INVALID_SOFA_ID]: "Provided sofa id was invalid.",
  [ClientErrorCode.SOFA_NOT_FOUND]: "Account doesn't have a sofa with the provided id.",
  //  *  *  815XX: /my/chairs errors
  [ClientErrorCode.INVALID_CHAIR_ID]: "Provided chair id was invalid.",
  [ClientErrorCode.CHAIR_NOT_FOUND]: "Account doesn't have a chair with the provided id.",
  //  *  *  816XX: /my/quilts errors
  [ClientErrorCode.INVALID_QUILT_ID]: "Provided quilt id was invalid.",
  [ClientErrorCode.QUILT_NOT_FOUND]: "Account doesn't have a quilt with the provided id.",
  // *  *  817XX: /my/blankets errors
  [ClientErrorCode.INVALID_BLANKET_ID]: "Provided blanket id was invalid.",
  [ClientErrorCode.BLANKET_NOT_FOUND]: "Account doesn't have a blanket with the provided id.",
  //  *  *  818XX: /my/business errors
  [ClientErrorCode.BUSINESS_NOT_FOUND]: "Account doesn't have a business.",
  [ClientErrorCode.BUSINESS_ALREADY_EXISTS]: "Account already has a business.",
  [ClientErrorCode.BUSINESS_IS_OPEN]: "Business is open. It can't be edited or deleted.",
  //  *  *  819XX: /my/business/hours errors
  [ClientErrorCode.BUSINESS_HOURS_NOT_FOUND]: "Business doesn't have hours.",
  [ClientErrorCode.BUSINESS_HOURS_ALREADY_EXISTS]: "Business already has hours.",
  //  *  *  820XX: /my/business/bank errors
  [ClientErrorCode.BANK_NOT_FOUND]: "Business doesn't have a bank.",
  [ClientErrorCode.BANK_ALREADY_EXISTS]: "Business already has a bank.",
  //  *  9XXXX: Catch-all errors
  [ClientErrorCode.RESOURCE_NOT_FOUND]: "The requested resource couldn't be found.",
};
