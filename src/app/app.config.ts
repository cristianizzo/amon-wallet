import { Injectable } from '@angular/core';
import { UtilsHelper } from '@helpers/utils';
import { Web3Services } from '@services/web3.service';
import { Store } from '@ngrx/store';
import { StateModel } from '@models/state.model';
import { ThemeActions, ProviderActions, LanguageActions, WalletActions } from '@app/core/actions';

@Injectable()
export class AppConfig {

  constructor(
    private web3Services: Web3Services,
    private utilsHelper: UtilsHelper,
    private store: Store<StateModel>,
  ) {
  }

  public async loadConfiguration() {

    this.store.dispatch(ThemeActions.initTheme());
    this.store.dispatch(ProviderActions.initProviders());
    this.store.dispatch(LanguageActions.initLanguage());

    await this.utilsHelper.wait(500);
    this.store.dispatch(WalletActions.initWallets());

    //print store
    this.store.select((store) => {
      console.log(store);
    }).subscribe();
  }
}
