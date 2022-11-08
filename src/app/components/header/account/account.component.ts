import { Component } from '@angular/core';
import { WalletSelector } from '@app/core/selectors';
import { Store } from '@ngrx/store';
import { StateModel } from '@models/state.model';
import { WalletModel } from '@app/models';
import { ModalController } from '@ionic/angular';
import { AccountMenuComponent } from '@components/header/account-menu/account-menu.component';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
})
export class AccountComponent {
  public wallet: WalletModel;
  public wallets: WalletModel[];

  constructor(
    private modalCtrl: ModalController,
    private store: Store<StateModel>
  ) {
    this.store
      .select(WalletSelector.getWallet)
      .subscribe((wallet) => (this.wallet = wallet));
  }

  public async openAccount() {
    const askPinCodeModal = await this.modalCtrl.create({
      id: 'account-menu',
      component: AccountMenuComponent,
      cssClass: ['account-menu'],
      backdropDismiss: true,
      canDismiss: true,
    });

    await askPinCodeModal.present();
  }

  public parseAddress(address: string) {
    if (address) {
      return `${address.slice(0, 5)}...${address.slice(address.length - 4)}`;
    }
  }

  /**
   * goBack Function
   */
  goBack() {}
}
