import { AccountRules } from "../../common/rules/AccountRules";
import { AddressRules } from "../../common/rules/AddressRules";
import { ApprovalRules } from "../../common/rules/ApprovalRules";
import { BankAccountRules } from "../../common/rules/BankAccountRules";
import { BusinessRules } from "../../common/rules/BusinessRules";
import { CampaignRules } from "../../common/rules/CampaignRules";
import { CardRules } from "../../common/rules/CardRules";
import { ChairRules } from "../../common/rules/ChairRules";
import { ContactRules } from "../../common/rules/ContactRules";
import { ItemRules } from "../../common/rules/ItemRules";
import { MessageRules } from "../../common/rules/MessageRules";
import { OrderRules } from "../../common/rules/OrderRules";
import { ReviewRules } from "../../common/rules/ReviewRules";
import { SearchRules } from "../../common/rules/SearchRules";
import { ServiceRules } from "../../common/rules/ServiceRules";
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
  INVALID_OWNER_LENGTH = 60016,
  INVALID_APPROVAL_MESSAGE_LENGTH = 60017,
  INVALID_APPROVAL_REASON_LENGTH = 60018,
  INVALID_SERVICE_TITLE_LENGTH = 60019,
  INVALID_SERVICE_DESCRIPTION_LENGTH = 60020,
  INVALID_SEARCH_QUERY_LENGTH = 60021,
  INVALID_CARD_NAME_LENGTH = 60022,
  INVALID_CARD_OWNER_LENGTH = 60023,
  INVALID_CARD_NUMBER_LENGTH = 60024,
  INVALID_CARD_CVV_LENGTH = 60025,
  INVALID_ORDER_NOTE_LENGTH = 60026,
  INVALID_MESSAGE_LENGTH = 60027,
  INVALID_REVIEW_COMMENT_LENGTH = 60028,
  INVALID_CAMPAIGN_TITLE_LENGTH = 60029,
  INVALID_CAMPAIGN_DESCRIPTION_LENGTH = 60030,
  //  *  7XXXX: Format errors
  INVALID_PHONE_CONTENT = 70001,
  INVALID_PASSWORD_CONTENT = 70002,
  INVALID_NAME_CONTENT = 70003,
  INVALID_SURNAME_CONTENT = 70004,
  INVALID_CODE_CONTENT = 70005,
  INVALID_ADDRESS_NAME_CONTENT = 70006,
  INVALID_EXPLICIT_ADDRESS_CONTENT = 70007,
  INVALID_ITEM_NAME_CONTENT = 70008,
  INVALID_ITEM_DESCRIPTION_CONTENT = 70009,
  DUPLICATE_MEDIA_IDS = 70010,
  MEDIA_TYPE_NOT_ALLOWED = 70011,
  INVALID_VEHICLE_BRAND_CONTENT = 70012,
  INVALID_VEHICLE_MODEL_CONTENT = 70013,
  INVALID_CHAIR_QUANTITY = 70014,
  INVALID_EMAIL_CONTENT = 70015,
  INVALID_BUSINESS_NAME_CONTENT = 70016,
  INVALID_BUSINESS_DESCRIPTION_CONTENT = 70017,
  INVALID_BUSINESS_HOUR_CONTENT = 70018,
  INVALID_IBAN_CONTENT = 70019,
  INVALID_OWNER_CONTENT = 70020,
  INVALID_APPROVAL_MESSAGE_CONTENT = 70021,
  INVALID_APPROVAL_REASON_CONTENT = 70022,
  INVALID_SERVICE_TITLE_CONTENT = 70023,
  INVALID_SERVICE_DESCRIPTION_CONTENT = 70024,
  INVALID_SERVICE_UNIT_PRICE = 70025,
  INVALID_SEARCH_QUERY_CONTENT = 70026,
  DUPLICATE_SERVICE_CATEGORIES = 70027,
  INVALID_CARD_NAME_CONTENT = 70028,
  INVALID_CARD_OWNER_CONTENT = 70029,
  INVALID_CARD_NUMBER_CONTENT = 70030,
  INVALID_CARD_EXPIRATION_MONTH_CONTENT = 70031,
  INVALID_CARD_EXPIRATION_YEAR_CONTENT = 70032,
  INVALID_CARD_CVV_CONTENT = 70033,
  INVALID_ORDER_NOTE_CONTENT = 70034,
  INVALID_MESSAGE_CONTENT = 70035,
  DUPLICATE_ITEM_IDS = 70036,
  INVALID_PRICE_CONTENT = 70037,
  INVALID_REVIEW_STARS_CONTENT = 70038,
  INVALID_REVIEW_COMMENT_CONTENT = 70039,
  INVALID_CAMPAIGN_TITLE_CONTENT = 70040,
  INVALID_CAMPAIGN_DESCRIPTION_CONTENT = 70041,

  // REQUEST ERRORS (8XXXX - 9XXXX)
  //  *  8XXXX: Route errors
  //  *  *  800XX: /login errors
  ACCOUNT_NOT_FOUND = 80001,
  INCORRECT_PASSWORD = 80002,
  //  *  *  801XX: /signup errors
  FORBIDDEN_ACCOUNT_TYPE = 80100,
  ACCOUNT_ALREADY_EXISTS = 80101,
  //  *  *  802XX: /my/sessions errors
  ACCOUNT_HAS_NO_SESSION_WITH_THIS_ID = 80200,
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
  ACCOUNT_HAS_NO_ADDRESS_WITH_THIS_ID = 80801,
  CANNOT_DELETE_DEFAULT_ADDRESS = 80802,
  //  *  *  809XX: /my/medias errors
  INVALID_MEDIA_TYPE = 80900,
  //  *  *  810XX: /my/carpets errors
  INVALID_CARPET_ID = 81000,
  ACCOUNT_HAS_NO_CARPET_WITH_THIS_ID = 81001,
  ACCOUNT_HAS_NO_MEDIA_WITH_THIS_ID = 81002,
  MEDIA_NOT_UPLOADED = 81004,
  //  *  *  811XX: /my/vehicles errors
  INVALID_VEHICLE_ID = 81100,
  ACCOUNT_HAS_NO_VEHICLE_WITH_THIS_ID = 81101,
  //  *  *  812XX: /my/curtains errors
  INVALID_CURTAIN_ID = 81200,
  ACCOUNT_HAS_NO_CURTAIN_WITH_THIS_ID = 81201,
  //  *  *  813XX: /my/beds errors
  INVALID_BED_ID = 81300,
  ACCOUNT_HAS_NO_BED_WITH_THIS_ID = 81301,
  //  *  *  814XX: /my/sofas errors
  INVALID_SOFA_ID = 81400,
  ACCOUNT_HAS_NO_SOFA_WITH_THIS_ID = 81401,
  //  *  *  815XX: /my/chairs errors
  INVALID_CHAIR_ID = 81500,
  ACCOUNT_HAS_NO_CHAIR_WITH_THIS_ID = 81501,
  //  *  *  816XX: /my/quilts errors
  INVALID_QUILT_ID = 81600,
  ACCOUNT_HAS_NO_QUILT_WITH_THIS_ID = 81601,
  //  *  *  817XX: /my/blankets errors
  ACCOUNT_HAS_NO_BLANKET_WITH_THIS_ID = 81700,
  ACCOUNT_BLANKET_NOT_FOUND = 81701,
  //  *  *  818XX: /my/business errors
  ACCOUNT_HAS_NO_BUSINESS = 81800,
  BUSINESS_ALREADY_EXISTS = 81801,
  BUSINESS_IS_OPEN = 81802,
  //  *  *  819XX: /my/business/hours errors
  HOURS_NOT_FOUND = 81900,
  HOURS_ALREADY_EXISTS = 81901,
  //  *  *  820XX: /my/business/bank errors
  BANK_ACCOUNT_NOT_FOUND = 82000,
  BANK_ACCOUNT_ALREADY_EXISTS = 82001,
  //  *  *  821XX: /my/business/medias errors
  INVALID_MEDIA_ID = 82100,
  BUSINESS_MEDIA_NOT_FOUND = 82101,
  //  *  *  822XX: /my/business/areas errors
  AREA_ALREADY_EXISTS = 82200,
  // *  *  823XX: /my/business/approval errors
  APPROVAL_NOT_FOUND = 82300,
  APPROVAL_ALREADY_APPROVED = 82301,
  APPROVAL_ALREADY_PENDING = 82302,
  //  *  *  824XX: /admin/approvals errors
  INVALID_BUSINESS_ID = 82400,
  // *  *  825XX: /my/business/services errors
  INVALID_SERVICE_ID = 82500,
  SERVICE_NOT_FOUND = 82501,
  SERVICE_CATEGORY_CANT_BE_CHANGED = 82502,
  //  *  *  826XX: /my/business/open errors
  BUSINESS_ALREADY_OPEN = 82600,
  BUSINESS_HAS_NO_APPROVAL = 82601,
  BUSINESS_NOT_APPROVED = 82602,
  BUSINESS_HAS_NO_BANK_ACCOUNT = 82603,
  BUSINESS_HAS_NO_AREA = 82604,
  BUSINESS_HAS_NO_HOURS = 82605,
  BUSINESS_HAS_NO_SERVICES = 82606,
  //  *  *  827XX: /my/business/close errors
  BUSINESS_ALREADY_CLOSED = 82700,
  //  *  *  828XX: /businesses/:businessId errors
  BUSINESS_NOT_FOUND = 82800,
  //  *  *  829XX: /my/cards errors
  INVALID_CARD_ID = 82900,
  ACCOUNT_HAS_NO_CARD_WITH_THIS_ID = 82901,
  CANNOT_DELETE_DEFAULT_CARD = 82902,
  //  *  *  830XX: /my/orders errors
  INVALID_ORDER_ID = 83000,
  ACCOUNT_HAS_NO_ORDER_WITH_THIS_ID = 83001,
  BUSINESS_IS_CLOSED = 83002,
  BUSINESS_DOESNT_SERVE_THIS_AREA = 83003,
  //  *  *  831XX: /my/business/orders errors
  BUSINESS_HAS_NO_ORDER_WITH_THIS_ID = 83100,
  //  *  *  832XX: /my/orders/:orderId/cancel errors
  ORDER_CANNOT_BE_CANCELED = 83200,
  //  *  *  833XX: /my/business/orders/:orderId/offer errors
  OFFER_CANNOT_BE_MADE = 83300,
  OFFER_CANNOT_BE_WITHDRAWN = 83301,
  //  *  *  834XX: /my/orders/:orderId/offer errors
  ORDER_CANNOT_BE_DECLINED = 83400,
  //  *  *  835XX: /my/orders/:orderId/complete errors
  ORDER_CANNOT_BE_COMPLETED = 83500,
  //  *  *  836XX: /my/orders/:orderId/review errors
  ORDER_IS_NOT_COMPLETED = 83600,
  ORDER_IS_ALREADY_REVIEWED = 83601,
  ORDER_HAS_NO_REVIEW = 83602,
  //  *  *  837XX: /my/business/reviews errors
  INVALID_REVIEW_ID = 83700,
  BUSINESS_HAS_NO_REVIEW_WITH_THIS_ID = 83701,
  REVIEW_IS_ALREADY_REPLIED = 83702,
  //  *  *  838XX: /my/business/campaigns errors
  INVALID_CAMPAIGN_ID = 83800,
  CAMPAIGN_NOT_FOUND = 83801,
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
  [ClientErrorCode.INVALID_IBAN_LENGTH]: `Provided IBAN wasn't in the length range of ${BankAccountRules.IBAN_MIN_LENGTH} to ${BankAccountRules.IBAN_MAX_LENGTH}.`,
  [ClientErrorCode.INVALID_OWNER_LENGTH]: `Provided bank account owner wasn't in the length range of ${BankAccountRules.OWNER_MIN_LENGTH} to ${BankAccountRules.OWNER_MAX_LENGTH}.`,
  [ClientErrorCode.INVALID_APPROVAL_MESSAGE_LENGTH]: `Provided approval message wasn't in the length range of ${ApprovalRules.MESSAGE_MIN_LENGTH} to ${ApprovalRules.MESSAGE_MAX_LENGTH}.`,
  [ClientErrorCode.INVALID_APPROVAL_REASON_LENGTH]: `Provided approval reason wasn't in the length range of ${ApprovalRules.REASON_MIN_LENGTH} to ${ApprovalRules.REASON_MAX_LENGTH}.`,
  [ClientErrorCode.INVALID_SERVICE_TITLE_LENGTH]: `Provided service title wasn't in the length range of ${ServiceRules.TITLE_MIN_LENGTH} to ${ServiceRules.TITLE_MAX_LENGTH}.`,
  [ClientErrorCode.INVALID_SERVICE_DESCRIPTION_LENGTH]: `Provided service description wasn't in the length range of ${ServiceRules.DESCRIPTION_MIN_LENGTH} to ${ServiceRules.DESCRIPTION_MAX_LENGTH}.`,
  [ClientErrorCode.INVALID_SEARCH_QUERY_LENGTH]: `Provided search query wasn't in the length range of ${SearchRules.QUERY_MIN_LENGTH} to ${SearchRules.QUERY_MAX_LENGTH}.`,
  [ClientErrorCode.INVALID_CARD_NAME_LENGTH]: `Provided card name wasn't in the length range of ${CardRules.NAME_MIN_LENGTH} to ${CardRules.NAME_MAX_LENGTH}.`,
  [ClientErrorCode.INVALID_CARD_OWNER_LENGTH]: `Provided card owner wasn't in the length range of ${CardRules.OWNER_MIN_LENGTH} to ${CardRules.OWNER_MAX_LENGTH}.`,
  [ClientErrorCode.INVALID_CARD_NUMBER_LENGTH]: `Provided card number wasn't in the length of ${CardRules.NUMBER_LENGTH}.`,
  [ClientErrorCode.INVALID_CARD_CVV_LENGTH]: `Provided card cvv wasn't in the length of ${CardRules.CVV_LENGTH}.`,
  [ClientErrorCode.INVALID_ORDER_NOTE_LENGTH]: `Provided order note wasn't in the length range of ${OrderRules.NOTE_MIN_LENGTH} to ${OrderRules.NOTE_MAX_LENGTH}.`,
  [ClientErrorCode.INVALID_MESSAGE_LENGTH]: `Provided message wasn't in the length range of ${MessageRules.CONTENT_MIN_LENGTH} to ${MessageRules.CONTENT_MAX_LENGTH}.`,
  [ClientErrorCode.INVALID_REVIEW_COMMENT_LENGTH]: `Provided review comment wasn't in the length range of ${ReviewRules.COMMENT_MIN_LENGTH} to ${ReviewRules.COMMENT_MAX_LENGTH}.`,
  [ClientErrorCode.INVALID_CAMPAIGN_TITLE_LENGTH]: `Provided campaign title wasn't in the length range of ${CampaignRules.TITLE_MIN_LENGTH} to ${CampaignRules.TITLE_MAX_LENGTH}.`,
  [ClientErrorCode.INVALID_CAMPAIGN_DESCRIPTION_LENGTH]: `Provided campaign description wasn't in the length range of ${CampaignRules.DESCRIPTION_MIN_LENGTH} to ${CampaignRules.DESCRIPTION_MAX_LENGTH}.`,
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
  [ClientErrorCode.INVALID_OWNER_CONTENT]:
    "Provided bank account owner contained invalid characters.",
  [ClientErrorCode.INVALID_APPROVAL_MESSAGE_CONTENT]:
    "Provided approval message contained invalid characters.",
  [ClientErrorCode.INVALID_APPROVAL_REASON_CONTENT]:
    "Provided approval reason contained invalid characters.",
  [ClientErrorCode.INVALID_SERVICE_TITLE_CONTENT]:
    "Provided service title contained invalid characters.",
  [ClientErrorCode.INVALID_SERVICE_DESCRIPTION_CONTENT]:
    "Provided service description contained invalid characters.",
  [ClientErrorCode.INVALID_SERVICE_UNIT_PRICE]: `Provided service unit price wasn't in the range of ${ServiceRules.UNIT_PRICE_MIN} to ${ServiceRules.UNIT_PRICE_MAX}.`,
  [ClientErrorCode.INVALID_SEARCH_QUERY_CONTENT]:
    "Provided search query contained invalid characters.",
  [ClientErrorCode.DUPLICATE_SERVICE_CATEGORIES]:
    "Provided service categories contained duplicates.",
  [ClientErrorCode.INVALID_CARD_NAME_CONTENT]: "Provided card name contained invalid characters.",
  [ClientErrorCode.INVALID_CARD_OWNER_CONTENT]: "Provided card owner contained invalid characters.",
  [ClientErrorCode.INVALID_CARD_NUMBER_CONTENT]:
    "Provided card number contained invalid characters.",
  [ClientErrorCode.INVALID_CARD_EXPIRATION_MONTH_CONTENT]: `Provided card expiration month is not in between ${CardRules.EXPIRATION_MONTH_MIN} and ${CardRules.EXPIRATION_MONTH_MAX}.`,
  [ClientErrorCode.INVALID_CARD_EXPIRATION_YEAR_CONTENT]: `Provided card expiration year is not in between ${CardRules.EXPIRATION_YEAR_MIN} and ${CardRules.EXPIRATION_YEAR_MAX}.`,
  [ClientErrorCode.INVALID_CARD_CVV_CONTENT]: "Provided card cvv contained invalid characters.",
  [ClientErrorCode.INVALID_ORDER_NOTE_CONTENT]: "Provided order note contained invalid characters.",
  [ClientErrorCode.INVALID_MESSAGE_CONTENT]: "Provided message contained invalid characters.",
  [ClientErrorCode.DUPLICATE_ITEM_IDS]: "Provided item ids contained duplicates.",
  [ClientErrorCode.INVALID_PRICE_CONTENT]: `Provided price is not in between ${OrderRules.PRICE_MIN} and ${OrderRules.PRICE_MAX}.`,
  [ClientErrorCode.INVALID_REVIEW_STARS_CONTENT]: `Provided review stars is not in between ${ReviewRules.STARS_MIN} and ${ReviewRules.STARS_MAX}.`,
  [ClientErrorCode.INVALID_REVIEW_COMMENT_CONTENT]:
    "Provided review comment contained invalid characters.",
  [ClientErrorCode.INVALID_CAMPAIGN_TITLE_CONTENT]:
    "Provided campaign title contained invalid characters.",
  [ClientErrorCode.INVALID_CAMPAIGN_DESCRIPTION_CONTENT]:
    "Provided campaign description contained invalid characters.",

  // REQUEST ERRORS (8XXXX - 9XXXX)
  //  *  8XXXX: Route errors
  //  *  *  800XX: /login errors
  [ClientErrorCode.ACCOUNT_NOT_FOUND]: "No account was found with the provided phone.",
  [ClientErrorCode.INCORRECT_PASSWORD]: "Provided password was incorrect.",
  //  *  *  801XX: /signup errors
  [ClientErrorCode.FORBIDDEN_ACCOUNT_TYPE]: "Provided account type can't be signed up.",
  [ClientErrorCode.ACCOUNT_ALREADY_EXISTS]: "An account already exists with the provided phone.",
  //  *  *  802XX: /my/sessions errors
  [ClientErrorCode.ACCOUNT_HAS_NO_SESSION_WITH_THIS_ID]:
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
  [ClientErrorCode.ACCOUNT_HAS_NO_ADDRESS_WITH_THIS_ID]:
    "Account doesn't have an address with the provided id.",
  [ClientErrorCode.CANNOT_DELETE_DEFAULT_ADDRESS]: "Default address can't be deleted.",
  //  *  *  809XX: /my/medias errors
  [ClientErrorCode.INVALID_MEDIA_TYPE]: "Provided media type was invalid.",
  //  *  *  810XX: /my/carpets errors
  [ClientErrorCode.INVALID_CARPET_ID]: "Provided carpet id was invalid.",
  [ClientErrorCode.ACCOUNT_HAS_NO_CARPET_WITH_THIS_ID]:
    "Account doesn't have a carpet with the provided id.",
  [ClientErrorCode.ACCOUNT_HAS_NO_MEDIA_WITH_THIS_ID]:
    "Account doesn't have a media with the provided id.",
  [ClientErrorCode.MEDIA_NOT_UPLOADED]: "Media wasn't uploaded to the bucket.",
  //  *  *  811XX: /my/vehicles errors
  [ClientErrorCode.INVALID_VEHICLE_ID]: "Provided vehicle id was invalid.",
  [ClientErrorCode.ACCOUNT_HAS_NO_VEHICLE_WITH_THIS_ID]:
    "Account doesn't have a vehicle with the provided id.",
  //  *  *  812XX: /my/curtains errors
  [ClientErrorCode.INVALID_CURTAIN_ID]: "Provided curtain id was invalid.",
  [ClientErrorCode.ACCOUNT_HAS_NO_CURTAIN_WITH_THIS_ID]:
    "Account doesn't have a curtain with the provided id.",
  //  *  *  813XX: /my/beds errors
  [ClientErrorCode.INVALID_BED_ID]: "Provided bed id was invalid.",
  [ClientErrorCode.ACCOUNT_HAS_NO_BED_WITH_THIS_ID]:
    "Account doesn't have a bed with the provided id.",
  //  *  *  814XX: /my/sofas errors
  [ClientErrorCode.INVALID_SOFA_ID]: "Provided sofa id was invalid.",
  [ClientErrorCode.ACCOUNT_HAS_NO_SOFA_WITH_THIS_ID]:
    "Account doesn't have a sofa with the provided id.",
  //  *  *  815XX: /my/chairs errors
  [ClientErrorCode.INVALID_CHAIR_ID]: "Provided chair id was invalid.",
  [ClientErrorCode.ACCOUNT_HAS_NO_CHAIR_WITH_THIS_ID]:
    "Account doesn't have a chair with the provided id.",
  //  *  *  816XX: /my/quilts errors
  [ClientErrorCode.INVALID_QUILT_ID]: "Provided quilt id was invalid.",
  [ClientErrorCode.ACCOUNT_HAS_NO_QUILT_WITH_THIS_ID]:
    "Account doesn't have a quilt with the provided id.",
  // *  *  817XX: /my/blankets errors
  [ClientErrorCode.ACCOUNT_HAS_NO_BLANKET_WITH_THIS_ID]: "Provided blanket id was invalid.",
  [ClientErrorCode.ACCOUNT_BLANKET_NOT_FOUND]:
    "Account doesn't have a blanket with the provided id.",
  //  *  *  818XX: /my/business errors
  [ClientErrorCode.ACCOUNT_HAS_NO_BUSINESS]: "Account doesn't have a business.",
  [ClientErrorCode.BUSINESS_ALREADY_EXISTS]: "Account already has a business.",
  [ClientErrorCode.BUSINESS_IS_OPEN]: "Business is open. It can't be edited or deleted.",
  //  *  *  819XX: /my/business/hours errors
  [ClientErrorCode.HOURS_NOT_FOUND]: "Business doesn't have hours.",
  [ClientErrorCode.HOURS_ALREADY_EXISTS]: "Business already has hours.",
  //  *  *  820XX: /my/business/bank errors
  [ClientErrorCode.BANK_ACCOUNT_NOT_FOUND]: "Business doesn't have a bank account.",
  [ClientErrorCode.BANK_ACCOUNT_ALREADY_EXISTS]: "Business already has a bank account.",
  //  *  *  821XX: /my/business/medias errors
  [ClientErrorCode.INVALID_MEDIA_ID]: "Provided media id was invalid.",
  [ClientErrorCode.BUSINESS_MEDIA_NOT_FOUND]: "Business doesn't have a media with the provided id.",
  //  *  *  822XX: /my/business/areas errors
  [ClientErrorCode.AREA_ALREADY_EXISTS]: "Business already has an area with the provided id.",
  // *  *  823XX: /my/business/approval errors
  [ClientErrorCode.APPROVAL_NOT_FOUND]: "Business doesn't have an approval.",
  [ClientErrorCode.APPROVAL_ALREADY_APPROVED]: "Business approval is already approved.",
  [ClientErrorCode.APPROVAL_ALREADY_PENDING]: "Business approval is already pending.",
  //  *  *  824XX: /admin/approvals errors
  [ClientErrorCode.INVALID_BUSINESS_ID]: "Provided business id was invalid.",
  // *  *  825XX: /my/business/services errors
  [ClientErrorCode.INVALID_SERVICE_ID]: "Provided service id was invalid.",
  [ClientErrorCode.SERVICE_NOT_FOUND]: "Business doesn't have a service with the provided id.",
  [ClientErrorCode.SERVICE_CATEGORY_CANT_BE_CHANGED]:
    "Service category can't be changed after creation.",
  //  *  *  826XX: /my/business/open errors
  [ClientErrorCode.BUSINESS_ALREADY_OPEN]: "Business is already open.",
  [ClientErrorCode.BUSINESS_HAS_NO_APPROVAL]: "Business doesn't have an approval.",
  [ClientErrorCode.BUSINESS_NOT_APPROVED]: "Business is not approved.",
  [ClientErrorCode.BUSINESS_HAS_NO_BANK_ACCOUNT]: "Business doesn't have a bank account.",
  [ClientErrorCode.BUSINESS_HAS_NO_AREA]: "Business doesn't have an area.",
  [ClientErrorCode.BUSINESS_HAS_NO_HOURS]: "Business doesn't have work hours.",
  [ClientErrorCode.BUSINESS_HAS_NO_SERVICES]: "Business doesn't have services.",
  //  *  *  827XX: /my/business/close errors
  [ClientErrorCode.BUSINESS_ALREADY_CLOSED]: "Business is already closed.",
  //  *  *  828XX: /businesses/:businessId errors
  [ClientErrorCode.BUSINESS_NOT_FOUND]: "No business was found with the provided id.",
  //  *  *  829XX: /my/cards errors
  [ClientErrorCode.INVALID_CARD_ID]: "Provided card id was invalid.",
  [ClientErrorCode.ACCOUNT_HAS_NO_CARD_WITH_THIS_ID]:
    "Account doesn't have a card with the provided id.",
  [ClientErrorCode.CANNOT_DELETE_DEFAULT_CARD]: "Default card can't be deleted.",
  //  *  *  830XX: /my/orders errors
  [ClientErrorCode.INVALID_ORDER_ID]: "Provided order id was invalid.",
  [ClientErrorCode.ACCOUNT_HAS_NO_ORDER_WITH_THIS_ID]:
    "Account doesn't have an order with the provided id.",
  [ClientErrorCode.BUSINESS_IS_CLOSED]: "Business is closed. It can't be ordered from.",
  [ClientErrorCode.BUSINESS_DOESNT_SERVE_THIS_AREA]: "Business doesn't serve this area.",
  //  *  *  831XX: /my/business/orders errors
  [ClientErrorCode.BUSINESS_HAS_NO_ORDER_WITH_THIS_ID]:
    "Business doesn't have an order with the provided id.",
  //  *  *  832XX: /my/orders/:orderId/cancel errors
  [ClientErrorCode.ORDER_CANNOT_BE_CANCELED]:
    "Order can't be canceled. It must be in a cancelable state.",
  //  *  *  833XX: /my/business/orders/:orderId/offer errors
  [ClientErrorCode.OFFER_CANNOT_BE_MADE]:
    "Offer can't be made. Order must be in an offerable state.",
  [ClientErrorCode.OFFER_CANNOT_BE_WITHDRAWN]:
    "Offer can't be withdrawn. Order must be in a withdrawable state.",
  //  *  *  834XX: /my/orders/:orderId/offer errors
  [ClientErrorCode.ORDER_CANNOT_BE_DECLINED]:
    "Order can't be declined. It must be in a declinable state.",
  //  *  *  835XX: /my/orders/:orderId/complete errors
  [ClientErrorCode.ORDER_CANNOT_BE_COMPLETED]:
    "Order can't be completed. It must be in a completable state.",
  //  *  *  836XX: /my/orders/:orderId/review errors
  [ClientErrorCode.ORDER_IS_NOT_COMPLETED]: "Order must be completed to leave a review.",
  [ClientErrorCode.ORDER_IS_ALREADY_REVIEWED]: "Order has already been reviewed.",
  [ClientErrorCode.ORDER_HAS_NO_REVIEW]: "Order doesn't have a review.",
  //  *  *  837XX: /my/business/reviews errors
  [ClientErrorCode.INVALID_REVIEW_ID]: "Provided review id was invalid.",
  [ClientErrorCode.BUSINESS_HAS_NO_REVIEW_WITH_THIS_ID]:
    "Business doesn't have a review with the provided id.",
  [ClientErrorCode.REVIEW_IS_ALREADY_REPLIED]: "Review has already been replied to.",
  //  *  *  838XX: /my/business/campaigns errors
  [ClientErrorCode.INVALID_CAMPAIGN_ID]: "Provided campaign id was invalid.",
  [ClientErrorCode.CAMPAIGN_NOT_FOUND]: "Business doesn't have a campaign with the provided id.",
  //  *  9XXXX: Catch-all errors
  [ClientErrorCode.RESOURCE_NOT_FOUND]: "The requested resource couldn't be found.",
};
