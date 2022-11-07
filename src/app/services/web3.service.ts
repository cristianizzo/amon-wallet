import { Injectable } from '@angular/core';
import { UtilsHelper } from '@helpers/utils';
import * as web3 from 'ethers';
import { ProviderModel } from '@models/provider.model';
import { WalletModel } from '@app/models';

@Injectable()

export class Web3Services {

  private web3 = web3;
  private provider: any;

  constructor(
    public utilsHelper: UtilsHelper,
  ) {
  }

  public async connectProvider(config: ProviderModel): Promise<{ blockNumber: number }> {
    try {
      this.provider = new this.web3.providers.JsonRpcProvider(
        config.rpc,
        {
          chainId: config.chainId,
          name: config.name,
        }
      );

      const blockNumber = await this.getBlockNumber();

      return {
        blockNumber
      };

    } catch (error) {
      console.log(error)
      throw error;
    }
  }

  public async getBlockNumber(): Promise<number> {
    return this.provider.getBlockNumber();
  }

  public getWallet({name, mnemonic = null, main = false, derivationPath = `m/44'/60'/0'/0/0`}): WalletModel {

    if (!mnemonic) {
      const generateMnemonic = this.generateMnemonic();
      mnemonic = generateMnemonic.mnemonic;
    }

    const wallet = this.web3.Wallet.fromMnemonic(mnemonic, derivationPath);

    return {
      main,
      name,
      basePath: derivationPath,
      address: wallet.address,
      phrase: wallet.mnemonic.phrase,
      privateKey: wallet.privateKey,
      walletType: 'mnemonic',
      signerType: 'secp256k1',
      isHardware: false,
    };
  }

  public async getBalance(address: string): Promise<string> {
    const balance = await this.provider.getBalance(address);
    return this.web3.utils.formatEther(balance);
  }

  public formatEther(balance: string): string {
    try {
      return this.web3.utils.formatEther(balance);
    } catch (_) {
      return '0';
    }
  }

  private generateMnemonic() {
    const mnemonic = this.web3.utils.entropyToMnemonic(this.web3.utils.randomBytes(32));

    return {
      mnemonic
    };
  }

}
