import type { Code } from "./code";

export type VerificationData = {
  phone: string;
  code: Code;
  sentAt: Date;
};
