import { Injectable } from '@angular/core';
import { UtilsHelper } from '@helpers/utils';
import { Web3Services } from '@services/web3.service';
import { Store } from '@ngrx/store';
import { StateModel } from '@models/state.model';
import {
  CurrencyActions,
  LanguageActions,
  NetworkActions,
  ThemeActions,
  TokenActions,
  WalletActions,
} from '@app/core/actions';
import {
  CurrencySelector,
  NetworkSelector,
  WalletSelector,
} from '@app/core/selectors';

@Injectable()
export class AppConfig {
  constructor(
    private web3Services: Web3Services,
    private utilsHelper: UtilsHelper,
    private store: Store<StateModel>
  ) {}

  public async loadConfiguration() {
    this.store.dispatch(NetworkActions.initNetworks());
    this.store.dispatch(CurrencyActions.initCurrencies());
    this.store.dispatch(ThemeActions.initTheme());
    this.store.dispatch(LanguageActions.initLanguage());

    await this.utilsHelper.wait(500);
    this.store.dispatch(WalletActions.initWallets());
  }

  private async initTokens() {
    await this.utilsHelper.combine(
      [
        this.store.select(NetworkSelector.getNetwork),
        this.store.select(CurrencySelector.getCurrency),
        this.store.select(WalletSelector.getWallet),
      ],
      ([network, currency, wallet]) => {
        if (
          this.utilsHelper.objectHasValue(network) &&
          this.utilsHelper.objectHasValue(currency) &&
          this.utilsHelper.objectHasValue(wallet)
        ) {
          this.store.dispatch(TokenActions.initTokens());
        }
      }
    );
  }
}
