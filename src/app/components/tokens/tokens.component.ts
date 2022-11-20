import { Component } from '@angular/core';
import {
  ChainSelector,
  TokenSelector,
  WalletSelector,
} from '@app/core/selectors';
import { Store } from '@ngrx/store';
import { StateModel } from '@models/state.model';
import { ChainModel, TokenModel, WalletModel } from '@app/models';
import { ModalController } from '@ionic/angular';
import { ImportTokenComponent } from '@components/import-token/import-token.component';

@Component({
  selector: 'app-tokens',
  templateUrl: './tokens.component.html',
  styleUrls: ['./tokens.component.scss'],
})
export class TokensComponent {
  public chain: ChainModel;
  public wallet: WalletModel;
  public tokens: TokenModel[];
  public showBalance: boolean;
  public loading: boolean;

  constructor(
    private store: Store<StateModel>,
    private modalCtrl: ModalController
  ) {
    this.loading = true;
    this.tokens = [];
    // TODO: move into the state
    this.showBalance = true;

    this.store
      .select(ChainSelector.getChain)
      .subscribe((chain) => (this.chain = chain));

    this.store
      .select(WalletSelector.getWallet)
      .subscribe((wallet) => (this.wallet = wallet));

    this.store.select(TokenSelector.getSelectedTokens).subscribe((tokens) => {
      console.log(tokens);
      this.tokens = tokens;
      this.loading = false;
    });
  }

  public goToToken(symbol: string) {
    console.log(symbol);
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
