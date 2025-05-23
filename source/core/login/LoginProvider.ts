import type { IProvider } from "../../app/interfaces/IProvider";
import { AccountProvider } from "../../common/providers/AccountProvider";

export class LoginProvider implements IProvider {
  public constructor(private readonly accountProvider = new AccountProvider()) {
    this.getAccountByPhone = this.accountProvider.getAccountByPhone.bind(this.accountProvider);
  }

  public readonly getAccountByPhone: typeof this.accountProvider.getAccountByPhone;
}
