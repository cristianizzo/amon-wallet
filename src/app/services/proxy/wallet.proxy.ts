import { Injectable } from '@angular/core';
import { WalletModel, WalletType } from '@app/models';
import { UtilsHelper } from '@helpers/utils';
import { from, Observable } from 'rxjs';
import assert from 'assert';
import { WalletService } from '../wallet.service';
import { CryptoHelper } from '@helpers/crypto';
import { Web3Services } from '../web3.service';
import { HDPathsHelper } from '@helpers/hdPaths';

@Injectable()
export class WalletProxy {
  constructor(
    private utilsHelper: UtilsHelper,
    private walletService: WalletService,
    private cryptoHelper: CryptoHelper,
    private web3Services: Web3Services,
    private hdPathsHelper: HDPathsHelper
  ) {
  }

  public initWallet(): Observable<WalletModel> {
    return from(
      this.utilsHelper.async(async () => {
        const dbWallets = await this.walletService.getWalletsFromStorage();
        let defaultWallet = dbWallets.find((w) => w.connected);

        if (defaultWallet) {
          defaultWallet = await this.walletService.fetchBalance(defaultWallet);
        }

        return defaultWallet;
      })
    );
  }

  public switchWalletAndFetchBalance({address}): Observable<WalletModel> {
    return from(
      this.utilsHelper.async(async () => {
        const dbWallet = await this.walletService.getWalletFromStorage(address);
        assert(dbWallet, 'notFound');

        const connectedWallet = await this.walletService.switchConnectedWallet(
          dbWallet
        );
        return await this.walletService.fetchBalance(connectedWallet);
      })
    );
  }

  public async getWalletWithDerivatePaths(
    offset = 0,
    limit = 10
  ): Promise<any> {
    const dbWallets = await this.walletService.getWalletsFromStorage();
    const mainWallet = dbWallets.find((w) => w.main);

    assert(mainWallet, 'notFound');

    const pathObject = this.hdPathsHelper.pathToObject(mainWallet.basePath);
    delete pathObject.index;
    const hdPaths = this.hdPathsHelper.getHdIndexPaths(
      pathObject,
      offset,
      limit
    );

    return Promise.all(
      hdPaths.map(async (path, index) => {
        const wallet = this.web3Services.getWallet({
          name: `Wallet ${index}`,
          mnemonic: mainWallet.phrase,
          derivationPath: path,
          main: true,
        });

        return await this.walletService.fetchBalance(wallet);
      })
    );
  }

  public async createWallet(
    name: string,
    derivationPath?: string
  ): Promise<WalletModel> {
    const dbWallets = await this.walletService.getWalletsFromStorage();

    if (!this.utilsHelper.arrayHasValue(dbWallets)) {
      return this.web3Services.getWallet({
        name,
        derivationPath: derivationPath
          ? derivationPath
          : this.hdPathsHelper.getHdMainPath(),
        main: true,
      });
    } else {
      return this.web3Services.getWallet({
        name,
        derivationPath: derivationPath
          ? derivationPath
          : this.hdPathsHelper.getNextPath(dbWallets),
        main: false,
      });
    }
  }

  public async importMainWalletFromMnemonic({
                                              name,
                                              mnemonic,
                                              derivationPath,
                                            }): Promise<WalletModel> {
    const dbWallets = await this.walletService.getWalletsFromStorage();

    assert(dbWallets.length === 0, 'mainWalletAlreadyExists');

    return this.web3Services.getWallet({
      name,
      mnemonic,
      derivationPath: derivationPath
        ? derivationPath
        : this.hdPathsHelper.getHdMainPath(),
      main: true,
    });
  }

  public async importWalletFromPrivateKey({
                                            name,
                                            privateKey,
                                          }): Promise<WalletModel> {
    return this.web3Services.getWalletFromPrivateKey({
      name,
      privateKey,
      main: false,
    });
  }

  public addWallet({wallet, secret}): Observable<WalletModel> {
    return from(
      this.utilsHelper.async(async () => {
        const dbWallet = await this.walletService.getWalletFromStorage(
          wallet.address
        );
        assert(!dbWallet, 'walletAlreadyExists');

        let encrypted = null;
        if (wallet.walletType === WalletType.mnemonic) {
          encrypted = await this.cryptoHelper.encrypt(
            wallet.phrase,
            secret,
            true
          );
        } else if (wallet.walletType === WalletType.privateKey) {
          encrypted = await this.cryptoHelper.encrypt(
            wallet.privateKey,
            secret,
            false
          );
        }

        assert(encrypted, 'failEncrypt');

        await this.walletService.verifyEncryption(
          encrypted,
          secret,
          wallet.walletType
        );

        await this.walletService.saveWalletToStorage({
          name: wallet.name,
          address: wallet.address,
          basePath: wallet.basePath,
          walletType: wallet.walletType,
          signerType: wallet.signerType,
          isHardware: wallet.isHardware,
          encrypted,
        });

        const connectedWallet = await this.walletService.switchConnectedWallet(
          wallet
        );
        return await this.walletService.fetchBalance(connectedWallet);
      })
    );
  }

  public renameWallet({address, name}): Observable<WalletModel> {
    return from(
      this.utilsHelper.async(async () => {
        const dbWallet = await this.walletService.getWalletFromStorage(address);
        assert(dbWallet, 'notFound');

        const updatedWallets =
          await this.walletService.renameAndUpdateWalletFromStorage(
            address,
            name
          );
        return updatedWallets.find((w) => w.address === address);
      })
    );
  }

  public deleteWallet({address}): Observable<WalletModel> {
    return from(
      this.utilsHelper.async(async () => {
        const dbWallets = await this.walletService.getWalletsFromStorage();
        const wallet = dbWallets.find((w) => w.address === address);
        assert(wallet, 'notFound');

        await this.walletService.deleteWalletFromStorage(address);
        return wallet;
      })
    );
  }

  public hasWallet(): Observable<boolean> {
    return from(
      this.utilsHelper.async(async () => {
        const dbWallets = await this.walletService.getWalletsFromStorage();
        return dbWallets.length > 0;
      })
    );
  }

  public async loadBalance(wallet: WalletModel) {
    return await this.walletService.fetchBalance(wallet);
  }

  public async getAllWallets(
    selectedWallets?: WalletModel
  ): Promise<WalletModel[]> {
    const dbWallets = await this.walletService.getWalletsFromStorage();
    const wallets = await this.walletService.fetchBalances(dbWallets);

    return wallets.map((w) => {
      w.connected = w.address === selectedWallets?.address;
      return w;
    });
  }
}
