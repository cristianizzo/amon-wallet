import { Injectable } from '@angular/core';
import { UtilsHelper } from '@helpers/utils';
import { providers, utils, Wallet } from 'ethers';
import { ProviderModel } from '@models/provider.model';
import { WalletModel } from '@app/models';
import { LocalForageService } from './localforage.service';
import { CryptoHelper } from '@app/helpers/crypto';

@Injectable()

export class Web3Services {

  private provider: any;

  constructor(
    public utilsHelper: UtilsHelper,
    private localForageService: LocalForageService,
    private cryptoHelper: CryptoHelper,
  ) {
  }

  public connectProvider(config: ProviderModel) {
    this.provider = new providers.StaticJsonRpcProvider(
      config.rpc,
      {
        chainId: config.chainId,
        name: config.name,
      }
    );
    console.log('connected provider', this.provider);
  }

  public createWalletFromMnemonic(name: string): WalletModel {

    const {mnemonic} = this.generateMnemonic();

    const basePath = `m/44'/60'/0'/0/0`;
    const wallet = Wallet.fromMnemonic(mnemonic, basePath);

    return {
      name,
      basePath,
      address: wallet.address,
      phrase: wallet.mnemonic.phrase,
      privateKey: wallet.privateKey,
      walletType: 'mnemonic',
      signerType: 'secp256k1',
      isHardware: false,
    };
  }

  private generateMnemonic() {
    const mnemonic = utils.entropyToMnemonic(utils.randomBytes(32));

    return {
      mnemonic
    };
  }

  // private async storeEncryptedVault(address: string, type: string, encryptData: any) {
  //
  //   const storage = await this.localForageService.getItem('encryptedVaults');
  //
  //   if (storage[address]) {
  //     //existing store
  //     console.error('already exist');
  //   }
  //
  //   // address: "0xbfbfee9d7cdadc8a7de9150e18ddfa4e6a7411e4"
  //   // basePath: "m/44'/60'/0'/0"
  //   // isHardware: false
  //   // name: "EVM Account 1"
  //   // pathIndex: 0
  //   // publicKey: "0xf5d87d253173a401cb2bfe7dea98d5291cfe7cbe486caca37a0871f74b5791e5dfc507a8925e772617322cad3ee37b99c07ea2d5add21548cb5a72f083e9099b"
  //   // signerType: "secp256k1"
  //   // walletType: "mnemonic"
  //
  //   storage[address] = {}
  //   // ciphertext: this.bufferToHex(ciphertext),
  //   //   salt: this.bufferToHex(sparams.salt),
  //   //   iv: this.bufferToHex(sparams.iv),
  //   //   version: 1,
  //   //   mac,
  // }
}
