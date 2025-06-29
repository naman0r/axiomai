import { IEncryptionService } from "../interfaces/services/IEncryptionService";
import crypto from "crypto";

const ALGORITHM = "aes-256-cbc";
const ENCRYPTION_KEY =
  process.env.ENCRYPTION_KEY || crypto.randomBytes(32).toString("hex"); // 32 characters

export class EncryptionService implements IEncryptionService {
  private getKey(): Buffer {
    if (!ENCRYPTION_KEY) {
      throw new Error("ENCRYPTION_KEY environment variable is required");
    }
    // Ensure key is exactly 32 bytes for AES-256
    return crypto.createHash("sha256").update(ENCRYPTION_KEY).digest();
  }

  encrypt(text: string): string {
    try {
      const key = this.getKey();
      const iv = crypto.randomBytes(16); // AES block size
      const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

      let encrypted = cipher.update(text, "utf8", "hex");
      encrypted += cipher.final("hex");

      // Prepend IV to encrypted data
      return iv.toString("hex") + ":" + encrypted;
    } catch (error) {
      throw new Error(
        "Encryption failed: " +
          (error instanceof Error ? error.message : "Unknown error")
      );
    }
  }

  decrypt(encrypted: string): string {
    try {
      const key = this.getKey();
      const parts = encrypted.split(":");

      if (parts.length !== 2) {
        // Handle legacy plain text tokens (backward compatibility)
        console.warn("Found unencrypted token, consider re-connecting Canvas");
        return encrypted;
      }

      const iv = Buffer.from(parts[0], "hex");
      const encryptedData = parts[1];
      const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);

      let decrypted = decipher.update(encryptedData, "hex", "utf8");
      decrypted += decipher.final("utf8");

      return decrypted;
    } catch (error) {
      // If decryption fails, might be a legacy plain text token
      console.warn("Decryption failed, treating as plain text token");
      return encrypted;
    }
  }
}
