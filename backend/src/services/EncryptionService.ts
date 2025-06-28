import { IEncryptionService } from "../interfaces/services/IEncryptionService";
import crypto from "crypto";

const ALGORITHM = "aes-256-cbc";
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY; // 32 characters, add to backend .env

export class EncryptionService implements IEncryptionService {
  encrypt(text: string): string {
    //stub... for now we can just store the keys as is, but we should use these methods. Once the metohds are implemented, no code change will be needed in theory.
    return text;
  }

  decrypt(encrypted: string): string {
    // stub.....
    return encrypted;
  }
}
