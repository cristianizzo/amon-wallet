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
    derivationPath,
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

  public async getTokenType(tokenAddress): Promise<TokenType | undefined> {
    const contractByteCode = await this.provider.getCode(tokenAddress);
    if (contractByteCode === '0x') {
      return;
    }

    const isNft = this.checkIfMethodExistOnContract(
      contractByteCode,
      'isApprovedForAll(address,address)'
    );

    if (
      !isNft &&
      this.checkIfMethodExistOnContract(contractByteCode, 'balanceOf(address)')
    ) {
      return TokenType.ERC20;
    }

    if (
      this.checkIfMethodExistOnContract(
        contractByteCode,
        'supportsInterface(bytes4)'
      )
    ) {
      const erc721Contract = new web3.Contract(
        tokenAddress,
        this.utilsHelper.abi.erc721,
        this.provider
      );

      const ifErc721 = await erc721Contract.supportsInterface('0x80ac58cd');
      const ifErc1155 = await erc721Contract.supportsInterface('0xd9b67a26');

      if (ifErc1155) {
        return TokenType.ERC1155;
      }

      if (ifErc721) {
        return TokenType.ERC721;
      }

      if (
        this.checkIfMethodExistOnContract(contractByteCode, 'tokenURI(uint256)')
      ) {
        return TokenType.ERC721;
      }

      if (this.checkIfMethodExistOnContract(contractByteCode, 'uri(uint256)')) {
        return TokenType.ERC1155;
      }
    }
  }

  public checkIfMethodExistOnContract(byteCode, method) {
    const signature = this.web3.utils.id(method).slice(0, 10).slice(2);
    return byteCode.indexOf(signature) !== -1;
  }

  public async getTokenInfo(
    tokenAddress: string,
    walletAddress: string
  ): Promise<TokenModel | null> {
    try {
      const tokenType = await this.getTokenType(tokenAddress);

      let contract;
      let balance = '0';

      if (tokenType === TokenType.ERC20) {
        contract = new web3.Contract(
          tokenAddress,
          this.utilsHelper.abi.erc20,
          this.provider
        );
        balance = await contract.balanceOf(walletAddress);
        // TODO: find a way to fetch image somewhere
      } else if (tokenType === TokenType.ERC721) {
        contract = new web3.Contract(
          tokenAddress,
          this.utilsHelper.abi.erc721,
          this.provider
        );
        balance = await contract.balanceOf(walletAddress);
        // TODO: fetch image
      } else if (tokenType === TokenType.ERC1155) {
        contract = new web3.Contract(
          tokenAddress,
          this.utilsHelper.abi.erc1155,
          this.provider
        );
        // TODO: fetch image
      } else {
        return null;
      }

      const { name, decimals, symbol } = await this.getTokenDetails(contract);

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
    derivationPath = undefined,
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
    derivationPath,
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
