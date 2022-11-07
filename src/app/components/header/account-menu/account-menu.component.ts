import { Component } from '@angular/core';
import { ProviderSelector, WalletSelector } from '@app/core/selectors';
import { Store } from '@ngrx/store';
import { StateModel } from '@models/state.model';
import { ProviderModel, WalletModel } from '@app/models';
import { WalletService } from '@services/wallet.service';
import { WalletModule } from '@app/modules/index.module';
import { ErrorService } from '@services/error.service';
import { ToastService } from '@services/toast.service';
import { Router } from '@angular/router';
import { TempStorageService } from '@services/tempStorage.service';
import { ModalController, PopoverController } from '@ionic/angular';
import { WalletMenuComponent } from '@components/header/wallet-menu/wallet-menu.component';
import assert from 'assert';
import { WalletActions } from '@app/core/actions';

@Component({
  selector: 'app-account-menu',
  templateUrl: './account-menu.component.html',
  styleUrls: ['./account-menu.component.scss']
})

export class AccountMenuComponent {

  public provider: ProviderModel;
  public wallet: WalletModel;
  public wallets: WalletModel[];
  public searchInputText: string;

  constructor(
    private readonly store: Store<StateModel>,
    private walletService: WalletService,
    private walletModule: WalletModule,
    private toastService: ToastService,
    private errorService: ErrorService,
    private tempStorageService: TempStorageService,
    private modalCtrl: ModalController,
    private router: Router,
    private popoverController: PopoverController,
  ) {
    this.store.select(ProviderSelector.getProvider).subscribe(provider => this.provider = provider);
    this.store.select(WalletSelector.getWallet).subscribe(wallet => this.wallet = wallet);
    this.store.select(WalletSelector.getWallets).subscribe(wallets => this.wallets = wallets);
  }

  /**
   * addNewWallet Function
   */
  public async addNewWallet() {

    try {

      const walletName = await this.walletModule.askWalletName();

      if (!walletName) {
        return;
      }

      assert(walletName && walletName.length >= 3, 'walletName');

      this.tempStorageService.data = {
        walletName,
      };

      await this.close();
      await this.router.navigate(['/seed-phrase']);

    } catch (error) {
      this.toastService.responseError(this.errorService.parseError(error));
    }
  }

  /**
   * importWallet Function
   */
  public async importWallet() {
    try {

      const walletName = await this.walletModule.askWalletName();

      if (!walletName) {
        return;
      }

      assert(walletName && walletName.length >= 3, 'walletName');

      this.tempStorageService.data = {
        walletName,
      };

      await this.close();
      await this.router.navigate(['/import-wallet/recovery-phrase']);

    } catch (error) {
      this.toastService.responseError(this.errorService.parseError(error));
    }
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
      alignment: 'end',
      componentProps: {
        wallet
      },
      translucent: false
    });

    await popover.present();

    const {data} = await popover.onDidDismiss();

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
    this.walletModule.copyAddress(wallet.address);
  }

  /**
   * Switch Action Function
   */
  private switchAction({action, wallet}) {
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
      default:
        return;
    }
  }

  /**
   * Switch Wallet Function
   */
  private switchWallet(wallet: WalletModel) {
    this.store.dispatch(WalletActions.switchDefaultWallet(wallet.address));
  }

  /**
   * Rename Wallet Function
   */
  private async renameWallet(wallet: WalletModel) {
    try {

      const walletName = await this.walletModule.askWalletName();

      if (!walletName) {
        return;
      }

      assert(walletName && walletName.length >= 3, 'walletName');

      this.store.dispatch(WalletActions.renameWallet(wallet.address, walletName));

    } catch (error) {
      this.toastService.responseError(this.errorService.parseError(error));
    }
  }

  /**
   * Delete Wallet Function
   */
  private deleteWallet(wallet: WalletModel) {
    console.log(wallet);
  }
}
