import {Component} from '@angular/core';
import {WalletModel, WalletType} from '@app/models';
import {NavParams, PopoverController} from '@ionic/angular';

@Component({
  selector: 'app-wallet-menu',
  templateUrl: './wallet-menu.component.html',
  styleUrls: ['./wallet-menu.component.scss'],
})
export class WalletMenuComponent {
  public wallet: WalletModel;

  constructor(
    public popoverController: PopoverController,
    private navParams: NavParams
  ) {
    this.wallet = this.navParams.get('wallet');
  }

  close(action: string) {
    this.popoverController.dismiss({ action, wallet: this.wallet });
  }

  isPrivateKeyWallet() {
    return this.wallet.walletType === WalletType.privkey;
  }
}
