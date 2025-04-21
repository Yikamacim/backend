import type { IRules } from "../../app/interfaces/IRules";

export class AddressRules implements IRules {
  public static readonly NAME_MIN_LENGTH = 1;
  public static readonly NAME_MAX_LENGTH = 32;
  public static readonly NAME_REGEX = /^\P{C}+$/u;

  public static readonly EXPLICIT_ADDRESS_MIN_LENGTH = 0;
  public static readonly EXPLICIT_ADDRESS_MAX_LENGTH = 256;
  public static readonly EXPLICIT_ADDRESS_REGEX = /^.*$/;
}
