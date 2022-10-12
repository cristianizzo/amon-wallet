export enum WalletType {
  mnemonic = 'mnemonic',
  privkey = 'privkey',
  ledger = 'ledger',
  trezor = 'trezor',
}

enum SignerType {
  secp256k1 = 'secp256k1', // ethereum
}

export class WalletModel {
  name: string;
  address: string;
  phrase: string;
  basePath: string;
  privateKey: string;
  walletType: string | WalletType;
  signerType: string | SignerType;
  isHardware: boolean;
}
