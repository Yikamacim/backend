import { Twilio } from "twilio";
import { EnvironmentHelper } from "../../../app/helpers/EnvironmentHelper";
import type { IHandler } from "../../../app/interfaces/IHandler";
import { UnexpectedVerificationError } from "../../../app/schemas/ServerError";
import type { Code } from "../@types/code";
import { CodeHelper } from "../app/helpers/CodeHelper";
import { SmsProvider } from "./SmsProvider";

export class SmsHandler implements IHandler {
  public constructor(
    private readonly provider = new SmsProvider(),
    private readonly twilio = new Twilio(
      EnvironmentHelper.get().twilioAccountSid,
      EnvironmentHelper.get().twilioAuthToken,
    ),
    private readonly twilioPhoneNumber = EnvironmentHelper.get().twilioPhoneNumber,
  ) {}

  public async send(phone: string): Promise<void> {
    const code = CodeHelper.generate();
    await this.provider.createOrUpdateVerification({
      phone,
      code,
      sentAt: new Date(),
    });
    await this.twilio.messages.create({
      body: `Your verification code is: ${code}`,
      from: this.twilioPhoneNumber,
      to: phone,
    });
  }

  public async verify(phone: string, code: Code): Promise<boolean> {
    const verification = await this.provider.getVerification(phone);
    // If no verification found
    if (verification === null) {
      throw new UnexpectedVerificationError();
    }
    if (verification.code !== code) {
      return false;
    }
    return true;
  }
}
