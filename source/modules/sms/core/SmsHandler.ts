import type { IHandler } from "../../../app/interfaces/IHandler";

export class SmsHandler implements IHandler {
  // public constructor(
  //   private readonly twilio = new Twilio(
  //     EnvironmentHelper.get().twilioAccountSid,
  //     EnvironmentHelper.get().twilioAuthToken,
  //   ),
  //   private readonly twilioPhoneNumber = EnvironmentHelper.get().twilioPhoneNumber,
  // ) {}
  // public async send(): Promise<void> {
  //   await this.twilio.messages.create({
  //     body: "Your verification code is: 123456",
  //     from: this.twilioPhoneNumber,
  //     to: "+905345814471",
  //   });
  // }
}
