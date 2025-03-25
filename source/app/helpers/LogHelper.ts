import type { IHelper } from "../interfaces/IHelper";

export class LogHelper implements IHelper {
  private static records: string[] = [];

  public static getRecords(): Promise<string[]> {
    return new Promise((resolve) => {
      resolve(this.records);
    });
  }

  public static deleteRecords(): Promise<void> {
    return new Promise(() => {
      this.records = [];
    });
  }

  public static log(message: string): void {
    const time = `[${this.getTime(new Date())}]`;
    const content = `[=]: ${message}`;
    this.records.push(`${time} ${content}`);
    console.log(
      `${this.BEGIN}${this.FG_BR_CYAN}${this.END}${time}${this.BEGIN}${this.FG_DEFAULT}${this.END} ${content}${this.RESET}`,
    );
  }

  public static detail(message: string, level: number): void {
    const time = `[${this.getTime(new Date())}]`;
    const content = `${"     ".repeat(level)}[-]: ${message}`;
    this.records.push(`${time} ${content}`);
    console.log(
      `${this.BEGIN}${this.FG_BR_CYAN}${this.END}${time}${this.BEGIN}${this.FG_DEFAULT};${this.DIM}${this.END} ${content}${this.RESET}`,
    );
  }

  public static system(message: string): void {
    const time = `[${this.getTime(new Date())}]`;
    const content = `[>]: ${message}`;
    this.records.push(`${time} ${content}`);
    console.log(
      `${this.BEGIN}${this.FG_BR_CYAN}${this.END}${time}${this.BEGIN}${this.FG_MAGENTA}${this.END} ${content}${this.RESET}`,
    );
  }

  public static progress(message: string): void {
    const time = `[${this.getTime(new Date())}]`;
    const content = `[~]: ${message}`;
    this.records.push(`${time} ${content}`);
    console.log(
      `${this.BEGIN}${this.FG_BR_CYAN}${this.END}${time}${this.BEGIN}${this.FG_CYAN}${this.END} ${content}${this.RESET}`,
    );
  }

  public static success(message: string): void {
    const time = `[${this.getTime(new Date())}]`;
    const content = `[+]: ${message}`;
    this.records.push(`${time} ${content}`);
    console.log(
      `${this.BEGIN}${this.FG_BR_CYAN}${this.END}${time}${this.BEGIN}${this.FG_GREEN}${this.END} ${content}${this.RESET}`,
    );
  }

  public static info(message: string): void {
    const time = `[${this.getTime(new Date())}]`;
    const content = `[i]: ${message}`;
    this.records.push(`${time} ${content}`);
    console.info(
      `${this.BEGIN}${this.FG_BR_CYAN}${this.END}${time}${this.BEGIN}${this.FG_BLUE}${this.END} ${content}${this.RESET}`,
    );
  }

  public static warning(message: string): void {
    const time = `[${this.getTime(new Date())}]`;
    const content = `[!]: ${message}`;
    this.records.push(`${time} ${content}`);
    console.warn(
      `${this.BEGIN}${this.FG_BR_CYAN}${this.END}${time}${this.BEGIN}${this.FG_YELLOW}${this.END} ${content}${this.RESET}`,
    );
  }

  public static failure(name: string, message: string | null): void {
    const time = `[${this.getTime(new Date())}]`;
    const content = message === null ? `[x]: ${name}` : `[x]: ${name} - ${message}`;
    this.records.push(`${time} ${content}`);
    console.error(
      `${this.BEGIN}${this.FG_BR_CYAN}${this.END}${time}${this.BEGIN}${this.FG_RED}${this.END} ${content}${this.RESET}`,
    );
  }

  private static getTime(date: Date): string {
    return date.toISOString().split(".")[0] + "Z";
  }

  // >---------------------------------------< ASCII CODES >---------------------------------------<

  // ASCII Fundamental Codes
  private static readonly BEGIN = "\x1b[";
  private static readonly END = "m";
  private static readonly RESET = `${this.BEGIN}0${this.END}`;

  // ASCII Style codes
  // private static readonly BOLD = 1;
  private static readonly DIM = 2;
  // private static readonly ITALIC = 3;
  // private static readonly UNDERLINE = 4;
  // private static readonly BLINK = 5;
  // private static readonly REVERSE = 7;
  // private static readonly HIDDEN = 8;
  // private static readonly STRIKE = 9;

  // ASCII Color codes
  // private static readonly FG_BLACK = 30;
  private static readonly FG_RED = 31;
  private static readonly FG_GREEN = 32;
  private static readonly FG_YELLOW = 33;
  private static readonly FG_BLUE = 34;
  private static readonly FG_MAGENTA = 35;
  private static readonly FG_CYAN = 36;
  // private static readonly FG_WHITE = 37;
  private static readonly FG_DEFAULT = 39;
  // private static readonly FG_BR_BLACK = 90;
  // private static readonly FG_BR_RED = 91;
  // private static readonly FG_BR_GREEN = 92;
  // private static readonly FG_BR_YELLOW = 93;
  // private static readonly FG_BR_BLUE = 94;
  // private static readonly FG_BR_MAGENTA = 95;
  private static readonly FG_BR_CYAN = 96;
  // private static readonly FG_BR_WHITE = 97;
  // private static readonly BG_BLACK = 40;
  // private static readonly BG_RED = 41;
  // private static readonly BG_GREEN = 42;
  // private static readonly BG_YELLOW = 43;
  // private static readonly BG_BLUE = 44;
  // private static readonly BG_MAGENTA = 45;
  // private static readonly BG_CYAN = 46;
  // private static readonly BG_WHITE = 47;
  // private static readonly BG_DEFAULT = 49;
  // private static readonly BG_BR_BLACK = 100;
  // private static readonly BG_BR_RED = 101;
  // private static readonly BG_BR_GREEN = 102;
  // private static readonly BG_BR_YELLOW = 103;
  // private static readonly BG_BR_BLUE = 104;
  // private static readonly BG_BR_MAGENTA = 105;
  // private static readonly BG_BR_CYAN = 106;
  // private static readonly BG_BR_WHITE = 107;
}
