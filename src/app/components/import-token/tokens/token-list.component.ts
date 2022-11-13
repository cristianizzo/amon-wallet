import { Component } from '@angular/core';
import {
  CurrencyModel,
  ProviderModel,
  StateModel,
  TokenModel,
  WalletModel,
} from '@app/models';
import {
  CurrencySelector,
  ProviderSelector,
  TokenSelector,
  WalletSelector,
} from '@app/core/selectors';
import { Store } from '@ngrx/store';
import { UtilsHelper } from '@helpers/utils';
import { TokenActions } from '@app/core/actions';
import _ from 'lodash';

@Component({
  selector: 'app-token-list',
  templateUrl: './token-list.component.html',
  styleUrls: ['./token-list.component.scss'],
})
export class TokenListComponent {
  public currency: CurrencyModel;
  public provider: ProviderModel;
  public wallet: WalletModel;
  public tokens: TokenModel[];
  public searchQuery: string;

  constructor(
    private utilsHelper: UtilsHelper,
    private readonly store: Store<StateModel>
  ) {
    this.store
      .select(ProviderSelector.getProvider)
      .subscribe((provider) => (this.provider = provider));

    this.store
      .select(CurrencySelector.getCurrency)
      .subscribe((currency) => (this.currency = currency));

    this.store
      .select(WalletSelector.getWallet)
      .subscribe((wallet) => (this.wallet = wallet));

    this.store.select(TokenSelector.getAllTokens).subscribe((tokens) => {
      this.tokens = _.cloneDeep(tokens);
    });
  }

  public toggleToken(address: string) {
    const token = this.tokens.find((tk) => tk.address === address);
    if (token.selected) {
      this.store.dispatch(TokenActions.unselectToken(address));
    } else {
      this.store.dispatch(
        TokenActions.selectToken(
          address,
          this.wallet,
          this.provider,
          this.currency
        )
      );
    }
  }
}
