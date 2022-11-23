import { Injectable } from '@angular/core';
import { UtilsHelper } from '@helpers/utils';
import { CryptoHelper } from '@helpers/crypto';
import { ChainModel } from '@models/chain.model';
import { TokenModel, TokenType, WalletModel } from '@app/models';
import * as web3 from 'ethers';
import logger from '@app/app.logger';

const logContent = logger.logContent('services:web3');

@Injectable()
export class Web3Services {
  private web3 = web3;
  private provider: any;

  constructor(
    public utilsHelper: UtilsHelper,
    private cryptoHelper: CryptoHelper
  ) {}

  public async connectChain(
    config: ChainModel
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
          info: `error connect chain`,
          error,
        })
      );

      throw error;
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

  public isValidPrivateKey(privateKey) {
    try {
      new web3.Wallet(privateKey);
      return true;
    } catch (e) {
      return false;
    }
  }

  public async getTokenDetails(tokenContract) {
    const details = {
      name: 'Unknown',
      decimals: 0,
      symbol: 'Unknown',
    };

    for (const detail in details) {
      if (details.hasOwnProperty(detail)) {
        try {
          details[detail] = await tokenContract[detail]();
        } catch (e) {
          logger.warn(
            logContent.add({
              info: `error fetch token ${detail}`,
              tokenAddress: tokenContract.address,
              e,
            })
          );
        }
      }
    }

    return details;
  }

  public async getTokenType(
    tokenAddress,
    walletAddress
  ): Promise<TokenType | undefined> {
    const encodedData = this.web3.utils.hexConcat([
      this.web3.utils.id('balanceOf(address)').slice(0, 10),
      this.web3.utils.defaultAbiCoder.encode(['address'], [walletAddress]),
    ]);

    const isValidToken = await this.provider.call({
      to: tokenAddress,
      data: encodedData,
    });

    if (isValidToken !== '0x') {
      const ifErc721encodedData = this.web3.utils.hexConcat([
        this.web3.utils.id('isApprovedForAll(address,address)').slice(0, 10),
        this.web3.utils.defaultAbiCoder.encode(
          ['address', 'address'],
          [tokenAddress, walletAddress]
        ),
      ]);

      try {
        await this.provider.call({
          to: tokenAddress,
          data: ifErc721encodedData,
        });

        return TokenType.ERC721;
      } catch (e) {
        return TokenType.ERC20;
      }
    }
  }

  public async getTokenInfo(
    tokenAddress: string,
    walletAddress: string
  ): Promise<TokenModel | null> {
    // TODO: check token type and fetch information and return
    try {
      const tokenType = await this.getTokenType(tokenAddress, walletAddress);

      let contract;

      if (tokenType === TokenType.ERC20) {
        contract = new web3.Contract(
          tokenAddress,
          this.utilsHelper.abi.erc20,
          this.provider
        );
      } else if (tokenType === TokenType.ERC721) { //ERC1155
        contract = new web3.Contract(
          tokenAddress,
          this.utilsHelper.abi.erc721,
          this.provider
        );
      } else {
        return null;
      }

      const { name, decimals, symbol } = await this.getTokenDetails(contract);

      const balance = await contract.balanceOf(walletAddress);

      const { chainId } = await this.provider.getNetwork();

      return {
        name,
        symbol,
        decimals,
        chainId,
        address: tokenAddress,
        type: tokenType,
        balance: this.formatEther(balance, decimals),
      };
    } catch (error) {
      console.log(error);
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
