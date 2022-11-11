import { Component } from '@angular/core';
import { ProviderSelector, WalletSelector } from '@app/core/selectors';
import { Store } from '@ngrx/store';
import { StateModel } from '@models/state.model';
import { CurrencyModel, ProviderModel, WalletModel } from '@app/models';
import { ModalController } from '@ionic/angular';
import { ImportTokenComponent } from '@components/import-token/import-token.component';

@Component({
  selector: 'app-tokens',
  templateUrl: './tokens.component.html',
  styleUrls: ['./tokens.component.scss'],
})
export class TokensComponent {
  public provider: ProviderModel;
  public wallet: WalletModel;
  public currency: CurrencyModel;
  public showBalance: boolean;
  public loading: boolean;
  public tokens: any;

  constructor(
    private store: Store<StateModel>,
    private modalCtrl: ModalController
  ) {
    // TODO: currency
    this.tokens = [];
    this.showBalance = true;
    this.currency = {
      symbol: 'USD',
      name: 'US Dollar',
      native: '$',
    };

    this.store
      .select(ProviderSelector.getProvider)
      .subscribe((provider) => (this.provider = provider));
    this.store
      .select(WalletSelector.getWallet)
      .subscribe((wallet) => (this.wallet = wallet));
  }

  public goToToken(tokenSymbol: string) {
    console.log(tokenSymbol);
  }

  public async openImportTokenModel() {
    const importTokenModal = await this.modalCtrl.create({
      id: 'import-token',
      component: ImportTokenComponent,
      cssClass: ['import-token'],
      backdropDismiss: false,
      canDismiss: true,
    });

    await importTokenModal.present();
  }
}
