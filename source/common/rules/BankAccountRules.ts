import type { IRules } from "../../app/interfaces/IRules";

export class BankAccountRules implements IRules {
  public static readonly OWNER_MIN_LENGTH = 1;
  public static readonly OWNER_MAX_LENGTH = 256;
  public static readonly OWNER_REGEX = /^[\p{L}\s\p{N}]+$/u;

  public static readonly IBAN_MIN_LENGTH = 15;
  public static readonly IBAN_MAX_LENGTH = 34;
  public static readonly IBAN_REGEX = /^[A-Z]{2}[0-9]{2}[0-9]*$/;
}
