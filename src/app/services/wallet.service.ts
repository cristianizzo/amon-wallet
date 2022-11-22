import { Injectable } from '@angular/core';
import { UtilsHelper } from '@helpers/utils';
import { CryptoHelper } from '@helpers/crypto';
import { LocalForageService } from '@services/localforage.service';
import { EncryptedDataModel, WalletModel, WalletType } from '@app/models';
import { Web3Services } from '@services/web3.service';
import assert from 'assert';
import logger from '@app/app.logger';

const logContent = logger.logContent('services:wallet');

@Injectable()
export class WalletService {
  constructor(
    private utilsHelper: UtilsHelper,
    private localForageService: LocalForageService,
    private cryptoHelper: CryptoHelper,
    private web3Services: Web3Services
  ) {}

  public async getWalletsFromStorage(): Promise<WalletModel[]> {
    const dbWallets = (await this.localForageService.getItem('wallets')) || [];

    return dbWallets;
  }

  public async getWalletFromStorage(address: string): Promise<WalletModel> {
    const dbWallets = (await this.localForageService.getItem('wallets')) || [];

    return dbWallets.find((w) => w.address === address);
  }

  public async saveWalletToStorage(wallet: WalletModel) {
    const dbWallets = await this.getWalletsFromStorage();

    dbWallets.push(
      Object.assign(wallet, {
        main: dbWallets.length === 0,
        connected: false,
      })
    );

    await this.updateWalletsToStorage(dbWallets);
    return dbWallets;
  }

  public async updateWalletsToStorage(dbWallets: WalletModel[]) {
    await this.localForageService.setItem('wallets', dbWallets);
    return dbWallets;
  }

  public async deleteWalletFromStorage(
    address: string
  ): Promise<WalletModel[]> {
    const dbWallets = await this.getWalletsFromStorage();

    const updatedWallets: WalletModel[] = dbWallets.filter(
      (w) => w.address !== address
    );

    await this.updateWalletsToStorage(updatedWallets);
    return updatedWallets;
  }

  public async renameAndUpdateWalletFromStorage(
    address: string,
    name: string
  ): Promise<WalletModel[]> {
    const dbWallets = await this.getWalletsFromStorage();

    const updatedWallets: WalletModel[] = dbWallets.reduce((acc, wallet) => {
      if (wallet.address === address) {
        wallet.name = name;
      }
      return [...acc, wallet];
    }, []);

    await this.updateWalletsToStorage(updatedWallets);
    return updatedWallets;
  }

  public async switchConnectedWallet(
    wallet: WalletModel
  ): Promise<WalletModel> {
    const dbWallets = await this.getWalletsFromStorage();

    const updatedWallets = dbWallets.map((w) =>
      Object.assign(w, {
        connected: w.address === wallet.address,
      })
    );

    await this.updateWalletsToStorage(updatedWallets);
    return updatedWallets.find((w) => w.connected);
  }

  public async fetchBalance(wallet: WalletModel): Promise<WalletModel> {
    const balance = await this.web3Services.getBalance(wallet.address);
    return Object.assign({}, wallet, {
      balance,
    });
  }

  public async fetchBalances(wallets: WalletModel[]): Promise<WalletModel[]> {
    const walletsWithBalance = await this.utilsHelper.asyncMap(
      wallets,
      async (wallet) => await this.fetchBalance(wallet),
      (error) => {
        logger.warn(
          logContent.add({
            info: `error fetch wallet balance`,
            error,
          })
        );
      }
    );
    return walletsWithBalance;
  }

  public verifyEncryption(
    encrypted: EncryptedDataModel,
    secret: string,
    walletType: WalletType
  ): Promise<boolean> {
    return this.utilsHelper.async(async () => {
      const decrypted = await this.cryptoHelper.decrypt(
        encrypted,
        secret,
        walletType
      );
      assert(decrypted, 'failVerifyEncryption');
      return true;
    });
  }

  public async walletAlreadyExists(address: string): Promise<boolean> {
    const dbWallets = await this.getWalletsFromStorage();
    const existingWallet = this.utilsHelper.arrayHasValue(dbWallets)
      ? dbWallets.find((w) => w.address === address)
      : null;
    return !!existingWallet;
  }

  public async decryptWallet({ wallet, secret }): Promise<WalletModel> {
    const decrypted = await this.cryptoHelper.decrypt(
      wallet.encrypted,
      secret,
      wallet.walletType
    );
    assert(decrypted, 'failDecrypt');

    if (wallet.walletType === WalletType.mnemonic) {
      return Object.assign({}, wallet, {
        phrase: decrypted,
      });
    }

    if (wallet.walletType === WalletType.privateKey) {
      return Object.assign({}, wallet, {
        privateKey: decrypted,
      });
    }
  }
}
