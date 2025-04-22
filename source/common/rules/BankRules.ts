import type { IRules } from "../../app/interfaces/IRules";

export class BankRules implements IRules {
  public static readonly IBAN_MIN_LENGTH = 15;
  public static readonly IBAN_MAX_LENGTH = 34;
  public static readonly IBAN_REGEX = /^[A-Z]{2}[0-9]{2}[0-9]*$/;
}
