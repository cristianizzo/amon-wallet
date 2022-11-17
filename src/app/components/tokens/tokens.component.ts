import { Component } from '@angular/core';
import {
  CurrencySelector,
  NetworkSelector,
  TokenSelector,
  WalletSelector,
} from '@app/core/selectors';
import { Store } from '@ngrx/store';
import { StateModel } from '@models/state.model';
import {
  CurrencyModel,
  NetworkModel,
  TokenModel,
  WalletModel,
} from '@app/models';
import { ModalController } from '@ionic/angular';
import { ImportTokenComponent } from '@components/import-token/import-token.component';

@Component({
  selector: 'app-tokens',
  templateUrl: './tokens.component.html',
  styleUrls: ['./tokens.component.scss'],
})
export class TokensComponent {
  public network: NetworkModel;
  public wallet: WalletModel;
  public currency: CurrencyModel;
  public showBalance: boolean;
  public loading: boolean;
  public tokens: TokenModel[];

  constructor(
    private store: Store<StateModel>,
    private modalCtrl: ModalController
  ) {
    this.tokens = [];
    // TODO: move into the state
    this.showBalance = true;

    this.store
      .select(CurrencySelector.getCurrency)
      .subscribe((currency) => (this.currency = currency));

    this.store
      .select(NetworkSelector.getNetwork)
      .subscribe((network) => (this.network = network));

    this.store
      .select(WalletSelector.getWallet)
      .subscribe((wallet) => (this.wallet = wallet));

    this.store
      .select(TokenSelector.getSelectedTokens)
      .subscribe((tokens) => (this.tokens = tokens));
  }

  public goToToken(tokenSymbol: string) {
    console.log(tokenSymbol);
  }

  public async openImportTokenModel() {
    const importTokenModal = await this.modalCtrl.create({
      id: 'import-token',
      component: ImportTokenComponent,
      cssClass: ['import-token'],
      backdropDismiss: true,
      canDismiss: true,
    });

    await importTokenModal.present();
  }
}
