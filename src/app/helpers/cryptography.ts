// import { Injectable } from '@angular/core';
// import { Cipher, createCipheriv, Decipher, randomBytes } from 'crypto';
// import { keccak256, stripHexPrefix } from 'web3-utils';
// import { scrypt } from 'ethereum-cryptography/scrypt';
//
// interface EncryptedData {
//   ciphertext: string;
//   salt: string;
//   iv: string;
//   version: number;
//   mac: string;
// }
//
// @Injectable()
// export class CryptographyHelper {
//
//   private scryptParams = {
//     cipher: 'aes-128-ctr',
//     kdf: 'scrypt',
//     dklen: 32,
//     n: 262144,
//     r: 8,
//     p: 1,
//   };
//
//   private bufferToHex = (buf: Buffer | Uint8Array, nozerox = false): string =>
//     nozerox ? Buffer.from(buf).toString('hex') : `0x${Buffer.from(buf).toString('hex')}`;
//
//   private hexToBuffer = (hex: string): Buffer =>
//     Buffer.from(stripHexPrefix(hex).length % 2 === 1 ? `0${stripHexPrefix(hex)}` : stripHexPrefix(hex), 'hex');
//
//   private runCipherBuffer = (cipher: Cipher | Decipher, data: Buffer): Buffer =>
//     Buffer.concat([cipher.update(data), cipher.final()]);
//
//
//   public encrypt = (msg: Buffer, password: string) => {
//
//     const sparams = {
//       ...{ salt: randomBytes(32), iv: randomBytes(16) },
//       ...this.scryptParams,
//     };
//
//     const derivedKey = await scrypt(
//       Buffer.from(password),
//       sparams.salt,
//       sparams.n,
//       sparams.p,
//       sparams.r,
//       sparams.dklen
//     );
//
//     const cipher = createCipheriv(
//       sparams.cipher,
//       derivedKey.slice(0, 16),
//       sparams.iv
//     );
//     const ciphertext = this.runCipherBuffer(cipher, msg);
//
//     const mac = keccak256(
//       this.bufferToHex(
//         Buffer.concat([
//           Buffer.from(derivedKey.slice(16, 32)),
//           Buffer.from(ciphertext),
//         ])
//       )
//     );
//     return {
//       ciphertext: this.bufferToHex(ciphertext),
//       salt: this.bufferToHex(sparams.salt),
//       iv: this.bufferToHex(sparams.iv),
//       version: 1,
//       mac,
//     };
//
//   };
//
//   public decrypt = (encryptedData: EncryptedData, password: string) => {
//
//     const sparams = {
//       ...{
//         ciphertext: this.hexToBuffer(encryptedData.ciphertext),
//         salt: this.hexToBuffer(encryptedData.salt),
//         iv: this.hexToBuffer(encryptedData.iv),
//         version: encryptedData.version,
//         mac: encryptedData.mac,
//       },
//       ...this.scryptParams,
//     };
//
//   };
// }
//
