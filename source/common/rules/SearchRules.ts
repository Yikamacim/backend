import type { IRules } from "../../app/interfaces/IRules";

export class SearchRules implements IRules {
  public static readonly QUERY_MIN_LENGTH = 0;
  public static readonly QUERY_MAX_LENGTH = 128;
  public static readonly QUERY_REGEX = /^\P{C}*$/u;
}
