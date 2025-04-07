import bcrypt from "bcrypt";
import type { IHelper } from "../interfaces/IHelper";

export class EncryptionHelper implements IHelper {
  public static async encrypt(data: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return await bcrypt.hash(data, salt);
  }

  public static async isMatching(data: string, encryptedData: string): Promise<boolean> {
    return await bcrypt.compare(data, encryptedData);
  }
}
