export interface IEncryptionService {
  encrypt(text: string): string;
  decrypt(encrypted: string): string;
}
