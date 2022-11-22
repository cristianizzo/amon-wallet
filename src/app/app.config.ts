import { Injectable } from '@angular/core';
import { UtilsHelper } from '@helpers/utils';
import { Web3Services } from '@services/web3.service';
import { Store } from '@ngrx/store';
import { StateModel } from '@models/state.model';
import {
  CurrencyActions,
  LanguageActions,
  ChainActions,
  ThemeActions,
  TokenActions,
  WalletActions,
} from '@app/core/actions';
import {
  CurrencySelector,
  ChainSelector,
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
    await this.utilsHelper.wait(500);
    this.store.dispatch(WalletActions.initWallet());
    this.initTokens();
  }

  private async initTokens() {
    await this.utilsHelper.combine(
      [
        this.store.select(ChainSelector.getChain),
        this.store.select(CurrencySelector.getCurrency),
        this.store.select(WalletSelector.getWallet),
      ],
      ([chain, currency, wallet]) => {
        if (
          this.utilsHelper.objectHasValue(chain) &&
          this.utilsHelper.objectHasValue(currency) &&
          this.utilsHelper.objectHasValue(wallet)
        ) {
          this.store.dispatch(TokenActions.initTokens());
        }
      }
    );
  }
}
