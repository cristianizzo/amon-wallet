import { EncryptedDataModel } from '@models/encryptedData.model';
import { TokenModel } from './token.model';

export enum WalletType {
  mnemonic = 'mnemonic',
  privkey = 'privkey',
  ledger = 'ledger',
  trezor = 'trezor',
}

enum SignerType {
  secp256k1 = 'secp256k1', // ethereum
}

export interface WalletModel {
  main?: boolean;
  connected?: boolean;
  name: string;
  address: string;
  balance?: string;
  tokens?: TokenModel[];
  phrase?: string;
  basePath?: string;
  privateKey?: string;
  walletType: string | WalletType;
  signerType: string | SignerType;
  isHardware: boolean;
  encrypted?: EncryptedDataModel;
}

