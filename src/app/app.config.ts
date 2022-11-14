import { Injectable } from '@angular/core';
import { UtilsHelper } from '@helpers/utils';
import { Web3Services } from '@services/web3.service';
import { Store } from '@ngrx/store';
import { StateModel } from '@models/state.model';
import {
  CurrencyActions,
  LanguageActions,
  ProviderActions,
  ThemeActions,
  TokenActions,
  WalletActions,
} from '@app/core/actions';
import {
  CurrencySelector,
  ProviderSelector,
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
    this.store.dispatch(ProviderActions.initProviders());
    this.store.dispatch(CurrencyActions.initCurrencies());
    this.store.dispatch(ThemeActions.initTheme());
    this.store.dispatch(LanguageActions.initLanguage());

    await this.utilsHelper.wait(500);
    this.store.dispatch(WalletActions.initWallets());
    await this.initConfig();
    // await this.listening();
  }

  private async initConfig() {
    await this.utilsHelper.combine(
      [
        this.store.select(ProviderSelector.getProvider),
        this.store.select(CurrencySelector.getCurrency),
        this.store.select(WalletSelector.getWallet),
      ],
      ([provider, currency, wallet]) => {
        this.store.dispatch(
          TokenActions.initTokens(provider, currency, wallet)
        );
      }
    );
  }

  private listening() {
    this.store
      .select(ProviderSelector.getProvider)
      .subscribe(async (provider) => {
        await this.utilsHelper.combine(
          [
            this.store.select(CurrencySelector.getCurrency),
            this.store.select(WalletSelector.getWallet),
          ],
          ([currency, wallet]) => {
            if (provider && currency && wallet) {
              this.store.dispatch(
                TokenActions.reloadTokens(provider, currency, wallet)
              );
            }
          }
        );
      });
  }
}
