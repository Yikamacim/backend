import type { IRules } from "../../app/interfaces/IRules";
import { OrderRules } from "./OrderRules";

export class MessageRules implements IRules {
  public static readonly CONTENT_MIN_LENGTH = OrderRules.NOTE_MIN_LENGTH;
  public static readonly CONTENT_MAX_LENGTH = OrderRules.NOTE_MAX_LENGTH;
  public static readonly CONTENT_REGEX = OrderRules.NOTE_REGEX;
}
