import { Component } from '@angular/core';
import { ChainSelector, WalletSelector } from '@app/core/selectors';
import { Store } from '@ngrx/store';
import { StateModel } from '@models/state.model';
import { ChainModel, WalletModel, WalletType } from '@app/models';
import { WalletService } from '@services/wallet.service';
import { ErrorService } from '@services/error.service';
import { ToastService } from '@services/toast.service';
import { Router } from '@angular/router';
import { TempStorageService } from '@services/tempStorage.service';
import { ModalController, PopoverController } from '@ionic/angular';
import { WalletMenuComponent } from '@components/account/wallet-menu/wallet-menu.component';
import assert from 'assert';
import { WalletActions } from '@app/core/actions';
import { ExportWalletComponent } from '@components/export-wallet/export-wallet.component';
import { Observable } from 'rxjs';
import { WalletHelper } from '@helpers/wallet';
import {
  LanguageProxy,
  WalletProxy,
  Web3Services,
} from '@app/services/index.module';
import { UtilsHelper } from '@helpers/utils';

@Component({
  selector: 'app-account-menu',
  templateUrl: './account-menu.component.html',
  styleUrls: ['./account-menu.component.scss'],
})
export class AccountMenuComponent {
  public chain$: Observable<ChainModel>;
  public wallets$: Observable<WalletModel[]>;
  public searchInputText: string;

  constructor(
    private readonly store: Store<StateModel>,
    private walletService: WalletService,
    private walletHelper: WalletHelper,
    private toastService: ToastService,
    private errorService: ErrorService,
    private tempStorageService: TempStorageService,
    private modalCtrl: ModalController,
    private router: Router,
    private popoverController: PopoverController,
    private walletProxy: WalletProxy,
    private web3Services: Web3Services,
    private utilsHelper: UtilsHelper,
    private languageProxy: LanguageProxy
  ) {}

  async ionViewWillEnter() {
    this.store.dispatch(WalletActions.getAllWallets());
    this.wallets$ = this.store.select(WalletSelector.getAllWallets);
    this.chain$ = this.store.select(ChainSelector.getChain);
  }

  ionViewWillLeave() {
    this.store.dispatch(WalletActions.resetWallets());
  }

  /**
   * addNewWallet Function
   */
  public async addNewWallet() {
    try {
      const walletName = await this.walletHelper.askWalletName();

      if (!walletName) {
        return;
      }

      assert(walletName && walletName.length >= 3, 'walletName');

      const wallet = await this.walletProxy.createWallet(walletName);
      wallet.walletType = 'privateKey';

      const secret = await this.walletHelper.askWalletSecret();
      const isValidSecret = await this.walletHelper.verifyMainWalletSecret(
        secret
      );

      if (!secret || !isValidSecret) {
        this.toastService.responseError(
          this.languageProxy.getTranslate('ERRORS.INVALID_SECRET')
        );
        return false;
      }

      this.store.dispatch(WalletActions.addWallet(wallet, secret));

      await this.utilsHelper.wait(3000);

      this.store.select(WalletSelector.getWallet).subscribe((w) => {
        if (w) {
          this.close();
        }
      });
    } catch (error) {
      this.toastService.responseError(this.errorService.parseError(error));
    }
  }

  /**
   * importWallet Function
   */

  public async importWallet() {
    await this.walletHelper.askRestoreWallet({
      privateKey: true,
      json: false, // TODO
    });

    await this.modalCtrl.dismiss();
  }

  /**
   * parseAddress Function
   */
  public parseAddress(address: string) {
    if (address) {
      return `${address.slice(0, 15)}...${address.slice(address.length - 4)}`;
    }
  }

  /**
   * openMenu Function
   */
  public async openMenu(event: any, wallet: WalletModel) {
    const popover = await this.popoverController.create({
      component: WalletMenuComponent,
      event,
      side: 'bottom',
      alignment: 'start',
      componentProps: {
        wallet,
      },
      translucent: false,
    });

    await popover.present();

    const { data } = await popover.onDidDismiss();

    if (data) {
      this.switchAction(data);
    }
  }

  /**
   * goBack Function
   */
  public async close() {
    await this.modalCtrl.dismiss(null, null, 'account-menu');
  }

  /**
   * Copy Address Function
   */
  public copyAddress(wallet: WalletModel) {
    this.walletHelper.copyAddress(wallet.address);
  }

  /**
   * Switch Action Function
   */
  private switchAction({ action, wallet }) {
    switch (action) {
      case 'connect':
        this.switchWallet(wallet);
        break;
      case 'rename':
        this.renameWallet(wallet);
        break;
      case 'copy':
        this.copyAddress(wallet);
        break;
      case 'delete':
        this.deleteWallet(wallet);
        break;
      case 'privateKey':
        this.exportPrivateKey(wallet);
        break;
      case 'privateKeyFromMnemonic':
        this.exportPrivateKeyFromSeed(wallet);
        break;
      case 'mnemonic':
        this.exportSeedPhrase(wallet);
        break;
      default:
        return;
    }
  }

  private addDerivatePath() {}

  /**
   * Switch Wallet Function
   */
  private switchWallet(wallet: WalletModel) {
    this.store.dispatch(WalletActions.connectWallet(wallet.address));
  }

  private async exportSeedPhrase(wallet: WalletModel) {
    try {
      const walletSecret = await this.walletHelper.askWalletSecret();
      const decrypted = await this.walletService.decryptWallet({
        wallet,
        secret: walletSecret,
      });

      const exportWalletModal = await this.modalCtrl.create({
        id: 'account-menu',
        component: ExportWalletComponent,
        cssClass: ['export-wallet'],
        backdropDismiss: true,
        canDismiss: true,
        componentProps: {
          address: wallet.address,
          decrypted: decrypted.phrase,
          walletType: wallet.walletType,
        },
      });

      await exportWalletModal.present();
    } catch (error) {
      this.toastService.responseError(this.errorService.parseError(error));
    }
  }

  private async exportPrivateKeyFromSeed(wallet: WalletModel) {
    try {
      const walletSecret = await this.walletHelper.askWalletSecret();
      const decrypted = await this.walletService.decryptWallet({
        wallet,
        secret: walletSecret,
      });

      const walletWithPK = this.web3Services.getWallet({
        name: wallet.name,
        mnemonic: decrypted.phrase,
        main: wallet.main,
        derivationPath: wallet.basePath,
      });

      const exportWalletModal = await this.modalCtrl.create({
        id: 'account-menu',
        component: ExportWalletComponent,
        cssClass: ['export-wallet'],
        backdropDismiss: true,
        canDismiss: true,
        componentProps: {
          address: walletWithPK.address,
          decrypted: walletWithPK.privateKey,
          walletType: 'privateKey',
        },
      });

      await exportWalletModal.present();
    } catch (error) {
      this.toastService.responseError(this.errorService.parseError(error));
    }
  }
  private async exportPrivateKey(wallet: WalletModel) {
    try {
      const walletSecret = await this.walletHelper.askWalletSecret();
      const decrypted = await this.walletService.decryptWallet({
        wallet,
        secret: walletSecret,
      });
      let privateKey = decrypted.privateKey;

      //TODO: we dont need this as its already checked on view
      if (wallet.walletType !== WalletType.privateKey) {
        const _wallet = await this.walletHelper.exportWallet({
          name: wallet.name,
          mnemonic: decrypted.phrase,
          privateKey: decrypted.privateKey,
        });
        privateKey = _wallet.privateKey;
      }

      const exportWalletModal = await this.modalCtrl.create({
        id: 'account-menu',
        component: ExportWalletComponent,
        cssClass: ['export-wallet'],
        backdropDismiss: true,
        canDismiss: true,
        componentProps: {
          address: wallet.address,
          decrypted: privateKey,
          walletType: WalletType.privateKey,
        },
      });

      await exportWalletModal.present();
    } catch (error) {
      this.toastService.responseError(this.errorService.parseError(error));
    }
  }

  /**
   * Rename Wallet Function
   */
  private async renameWallet(wallet: WalletModel) {
    try {
      const walletName = await this.walletHelper.askWalletName();

      if (!walletName) {
        return;
      }

      assert(walletName && walletName.length >= 3, 'walletName');

      this.store.dispatch(
        WalletActions.renameWallet(wallet.address, walletName)
      );
    } catch (error) {
      this.toastService.responseError(this.errorService.parseError(error));
    }
  }

  /**
   * Delete Wallet Function
   */
  private async deleteWallet(wallet: WalletModel) {
    const deleteWallet = await this.walletHelper.askDeleteWallet();

    if (!deleteWallet) {
      return;
    }

    try {
      this.store.dispatch(WalletActions.deleteWallet(wallet.address));
    } catch (error) {
      this.toastService.responseError(this.errorService.parseError(error));
    }
  }
}
