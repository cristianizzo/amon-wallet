import { Injectable } from '@angular/core';
import { EncryptedDataModel } from '@app/models';
import crypto, { Cipher, createCipheriv, createDecipheriv, Decipher, randomBytes } from 'crypto';
import { scrypt } from 'ethereum-cryptography/scrypt';
import { keccak256, stripHexPrefix } from 'web3-utils';
import { utils } from 'ethers';

@Injectable()
export class CryptoHelper {

  // eslint-disable-next-line @typescript-eslint/naming-convention
  private CIPHER_ALGORYTHM = 'aes-128-ctr';

  public hash(str, algo = 'sha256') {
    const hash = crypto.createHash(algo);

    hash.update(str);
    const hex = hash.digest('hex');

    return hex;
  };

  public bufferToHex = (buf: Buffer | Uint8Array, nozerox = false): string =>
    nozerox ? Buffer.from(buf).toString('hex') : `0x${Buffer.from(buf).toString('hex')}`;

  public hexToBuffer = (hex: string): Buffer =>
    Buffer.from(stripHexPrefix(hex).length % 2 === 1 ? `0${stripHexPrefix(hex)}` : stripHexPrefix(hex), 'hex');

  public runCipherBuffer = (cipher: Cipher | Decipher, data: Buffer): Buffer =>
    Buffer.concat([cipher.update(data), cipher.final()]);

  public async encrypt(msg: string, password: string): Promise<EncryptedDataModel> {

    const entropyMsg = this.hexToBuffer(utils.mnemonicToEntropy(msg));

    const sparams = {
      cipher: this.CIPHER_ALGORYTHM,
      kdf: 'scrypt',
      dklen: 32,
      n: 262144,
      r: 8,
      p: 1,
      salt: randomBytes(32),
      iv: randomBytes(16),
    };

    const derivedKey = await scrypt(
      Buffer.from(password),
      sparams.salt,
      sparams.n,
      sparams.p,
      sparams.r,
      sparams.dklen
    );

    const cipher = createCipheriv(sparams.cipher, derivedKey.slice(0, 16), sparams.iv);

    const ciphertext = this.runCipherBuffer(cipher, entropyMsg);

    const mac = keccak256(
      this.bufferToHex(
        Buffer.concat([
          Buffer.from(derivedKey.slice(16, 32)),
          Buffer.from(ciphertext),
        ])
      )
    );

    return {
      ciphertext: this.bufferToHex(ciphertext),
      salt: this.bufferToHex(sparams.salt),
      iv: this.bufferToHex(sparams.iv),
      version: 1,
      mac,
    };
  }

  public async decrypt(encryptedData: EncryptedDataModel, password: string): Promise<string> {

    const sparams = {
      cipher: this.CIPHER_ALGORYTHM,
      kdf: 'scrypt',
      dklen: 32,
      n: 262144,
      r: 8,
      p: 1,
      ciphertext: this.hexToBuffer(encryptedData.ciphertext),
      salt: this.hexToBuffer(encryptedData.salt),
      iv: this.hexToBuffer(encryptedData.iv),
      version: encryptedData.version,
      mac: encryptedData.mac,
    };

    const derivedKey = await scrypt(
      Buffer.from(password),
      sparams.salt,
      sparams.n,
      sparams.p,
      sparams.r,
      sparams.dklen
    );

    const mac = keccak256(this.bufferToHex(Buffer.concat([Buffer.from(derivedKey.slice(16, 32)), sparams.ciphertext])));

    if (mac !== sparams.mac) {
      throw new Error('wrongPassword');
    }

    const decipher = createDecipheriv(sparams.cipher, derivedKey.slice(0, 16), sparams.iv);
    const decryptedEntropy = this.runCipherBuffer(decipher, sparams.ciphertext);
    return utils.entropyToMnemonic(decryptedEntropy);
  }
}
