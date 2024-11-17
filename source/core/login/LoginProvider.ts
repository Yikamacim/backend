import type { IProvider } from "../../app/interfaces/IProvider";
import { AccountProvider } from "../../common/providers/AccountProvider";

export class LoginProvider implements IProvider {
  public constructor(private readonly accountProvider = new AccountProvider()) {
    this.getAccount = this.accountProvider.getAccountByUsername.bind(this.accountProvider);
  }

  public getAccount: typeof this.accountProvider.getAccountByUsername;
}
