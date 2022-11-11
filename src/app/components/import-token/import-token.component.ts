import { Component } from '@angular/core';
import { StateModel, TokenModel, WalletModel } from '@app/models';
import { Store } from '@ngrx/store';
import { ModalController } from '@ionic/angular';
import { TokenSelector, WalletSelector } from '@app/core/selectors';
import { UtilsHelper } from '@helpers/utils';
import { TokenActions } from '@app/core/actions';
import { wallet } from 'ionicons/icons';

enum TabTypeEnum {
  default = 'default',
  custom = 'custom',
}

@Component({
  selector: 'app-import-token',
  templateUrl: './import-token.component.html',
  styleUrls: ['./import-token.component.scss'],
})
export class ImportTokenComponent {
  public tabTypeEnum = TabTypeEnum;
  public wallet: WalletModel;
  public tokenList: TokenModel[];
  public tokens: TokenModel[];
  public selectedTabType: string;
  public searchQuery: string;

  constructor(
    private modalCtrl: ModalController,
    private utilsHelper: UtilsHelper,
    private readonly store: Store<StateModel>
  ) {
    this.selectedTabType = this.tabTypeEnum.default;
    this.store
      .select(WalletSelector.getWallet)
      .subscribe((w) => (this.wallet = w));
    this.store.select(TokenSelector.getDefaultTokens).subscribe((tokens) => {
      this.tokenList = tokens;
      this.tokens = tokens;
    });
  }

  public onSelectTabType = (tab: string) => {
    this.selectedTabType = tab;
    console.log(tab);
  };

  public addToken(token: TokenModel) {
    this.store.dispatch(TokenActions.addToken(token, this.wallet));

    this.store.select(TokenSelector.getSelectedToken).subscribe((tokens) => {
      const newToken = tokens.find((t) => t.address === token.address);
      if (newToken) {
        // success close modal
      }
    });
  }

  /**
   * goBack Function
   */
  public async close() {
    await this.modalCtrl.dismiss(null, null, 'import-token');
  }
}
