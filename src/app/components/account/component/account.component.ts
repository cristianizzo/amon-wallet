import { Component } from '@angular/core';
import { WalletSelector } from '@app/core/selectors';
import { Store } from '@ngrx/store';
import { StateModel } from '@models/state.model';
import { WalletModel } from '@app/models';
import { ModalController } from '@ionic/angular';
import { AccountMenuComponent } from '@components/account/account-menu/account-menu.component';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
})
export class AccountComponent {
  public wallet: WalletModel;

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
}
