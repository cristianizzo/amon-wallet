import { Injectable } from '@angular/core';
import { UtilsHelper } from '@helpers/utils';
import { CryptoHelper } from '@helpers/crypto';
import { ProviderModel } from '@models/provider.model';
import { TokenModel, WalletModel } from '@app/models';
import * as web3 from 'ethers';
import logger from '@app/app.logger';
import assert from 'assert';

const logContent = logger.logContent('services:web3');

@Injectable()
export class Web3Services {
  private web3 = web3;
  private provider: any;

  constructor(
    public utilsHelper: UtilsHelper,
    private cryptoHelper: CryptoHelper
  ) {}

  public async connectProvider(
    config: ProviderModel
  ): Promise<{ blockNumber: number }> {
    try {
      this.provider = new this.web3.providers.JsonRpcProvider(config.rpc, {
        chainId: config.chainId,
        name: config.name,
      });

      const blockNumber = await this.getBlockNumber();

      return {
        blockNumber,
      };
    } catch (error) {
      logger.error(
        logContent.add({
          info: `error connect provider`,
          error,
        })
      );
      assert(false, 'connectionError');
    }
  }

  public async getBlockNumber(): Promise<number> {
    return this.provider.getBlockNumber();
  }

  public getWallet({
    name,
    mnemonic = null,
    main = false,
    derivationPath = `m/44'/60'/0'/0/0`,
  }): WalletModel {
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

  public async getTokenBalance(
    tokenAddress: string,
    walletAddress: string
  ): Promise<string> {
    try {
      const contract = new web3.Contract(
        tokenAddress,
        this.utilsHelper.abi.erc20,
        this.provider
      );
      const balance = await contract.balanceOf(walletAddress);
      return this.formatEther(balance);
    } catch (error) {
      logger.warn(
        logContent.add({
          info: `error fetch token balance`,
          tokenAddress,
          walletAddress,
          error,
        })
      );

      return '0';
    }
  }

  public async getTokenInfo(
    tokenAddress: string,
    walletAddress: string
  ): Promise<TokenModel> {
    try {
      const contract = new web3.Contract(
        tokenAddress,
        this.utilsHelper.abi.erc20,
        this.provider
      );
      const balance = await contract.balanceOf(walletAddress);
      const name = await contract.name();
      const symbol = await contract.symbol();
      const decimals = await contract.decimals();
      const { chainId } = await this.provider.getNetwork();

      return {
        name,
        symbol,
        decimals,
        chainId,
        address: tokenAddress,
        type: 'ERC20',
        balance: this.formatEther(balance),
      };
    } catch (error) {
      logger.warn(
        logContent.add({
          info: `error fetch token balance`,
          tokenAddress,
          walletAddress,
          error,
        })
      );

      throw error;
    }
  }

  public formatEther(balance: string): string {
    try {
      return this.web3.utils.formatEther(balance);
    } catch (_) {
      return '0';
    }
  }

  public getWalletFromPrivateKey({
    name,
    privateKey,
    main = false,
    derivationPath = `m/44'/60'/0'/0/0`,
  }): WalletModel {
    const buffer = this.cryptoHelper.hexToBuffer(privateKey);
    const wallet = new this.web3.Wallet(buffer);

    return {
      name,
      main,
      basePath: derivationPath,
      address: wallet.address,
      privateKey: wallet.privateKey,
      walletType: 'privkey',
      isHardware: false,
      signerType: 'secp256k1',
    };
  }

  public getWalletFromKeyStoreJSON({
    name,
    walletJson,
    password,
    main = false,
    derivationPath = `m/44'/60'/0'/0/0`,
  }): WalletModel {
    const wallet = this.web3.Wallet.fromEncryptedJsonSync(walletJson, password);

    return {
      name,
      main,
      basePath: derivationPath,
      address: wallet.address,
      privateKey: wallet.privateKey,
      walletType: 'privkey',
      isHardware: false,
      signerType: 'secp256k1',
    };
  }

  private generateMnemonic() {
    const mnemonic = this.web3.utils.entropyToMnemonic(
      this.web3.utils.randomBytes(32)
    );

    return {
      mnemonic,
    };
  }
}
