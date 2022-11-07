export interface EncryptedDataModel {
  ciphertext: string;
  salt: string;
  iv: string;
  version: number;
  mac: string;
}
