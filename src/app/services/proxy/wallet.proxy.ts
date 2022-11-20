import { Injectable } from '@angular/core';
import { WalletModel, WalletType } from '@app/models';
import { UtilsHelper } from '@helpers/utils';
import { from, Observable } from 'rxjs';
import assert from 'assert';
import { WalletService } from '../wallet.service';
import { CryptoHelper } from '@helpers/crypto';

@Injectable()
export class WalletProxy {
  constructor(
    private utilsHelper: UtilsHelper,
    private walletService: WalletService,
    private cryptoHelper: CryptoHelper
  ) {}

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

  public switchWalletAndFetchBalance({ address }): Observable<WalletModel> {
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

  public addWallet({ wallet, secret }): Observable<WalletModel> {
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

  public renameWallet({ address, name }): Observable<WalletModel> {
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

  public deleteWallet({ address }): Observable<WalletModel[]> {
    return from(
      this.utilsHelper.async(async () => {
        const dbWallets = await this.walletService.getWalletsFromStorage();
        assert(
          dbWallets.find((w) => w.address === address),
          'notFound'
        );

        await this.walletService.deleteWalletFromStorage(address);
        return true;
      })
    );
  }

  public hasWallet(): Observable<boolean> {
    return from(
      this.utilsHelper.async(async () => {
        const dbWallets = await this.getAllWallets();
        return dbWallets.length > 0;
      })
    );
  }

  public async getAllWallets(): Promise<WalletModel[]> {
    return await this.walletService.getWalletsFromStorage();
  }
}
