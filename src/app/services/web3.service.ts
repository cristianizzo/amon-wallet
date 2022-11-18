import { Injectable } from '@angular/core';
import { UtilsHelper } from '@helpers/utils';
import { CryptoHelper } from '@helpers/crypto';
import { NetworkModel } from '@models/network.model';
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

  public async connectNetwork(
    config: NetworkModel
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
          info: `error connect network`,
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
    walletAddress: string,
    decimals: number
  ): Promise<string> {
    try {
      const contract = new web3.Contract(
        tokenAddress,
        this.utilsHelper.abi.erc20,
        this.provider
      );
      const balance = await contract.balanceOf(walletAddress);
      return this.formatEther(balance, decimals);
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

      let balance = '0x0';
      try {
        balance = await contract.balanceOf(walletAddress);
      } catch (error) {
        logger.warn(
          logContent.add({
            info: `error fetch token balance`,
            tokenAddress,
            walletAddress,
            error,
          })
        );
      }

      let name = 'unknown';
      try {
        name = await contract.name();
      } catch (error) {
        logger.warn(
          logContent.add({
            info: `error fetch token name`,
            tokenAddress,
            walletAddress,
            error,
          })
        );
      }

      let symbol = 'UNKNOWN';
      try {
        symbol = await contract.symbol();
      } catch (error) {
        logger.warn(
          logContent.add({
            info: `error fetch token name`,
            tokenAddress,
            walletAddress,
            error,
          })
        );
      }

      let decimals = 0;
      try {
        decimals = await contract.decimals();
      } catch (error) {
        logger.warn(
          logContent.add({
            info: `error fetch token decimals`,
            tokenAddress,
            walletAddress,
            error,
          })
        );
      }

      const { chainId } = await this.provider.getNetwork();

      return {
        name,
        symbol,
        decimals,
        chainId,
        address: tokenAddress,
        type: 'ERC20',
        balance: this.formatEther(balance, decimals),
      };
    } catch (error) {
      logger.warn(
        logContent.add({
          info: `error fetch token info`,
          tokenAddress,
          walletAddress,
          error,
        })
      );
    }
  }

  public formatEther(balance: string, decimals = 18): string {
    try {
      return this.web3.utils.formatUnits(balance, decimals);
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
      walletType: 'privateKey',
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
      walletType: 'privateKey',
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
