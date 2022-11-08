import { environment } from '@env/environment';
import { ActionReducerMap, MetaReducer } from '@ngrx/store';
import * as WalletReducer from '@app/core/reducers/wallet';
import * as ProviderReducer from '@app/core/reducers/provider';
import * as LanguageReducer from '@app/core/reducers/language';
import * as ThemeReducer from '@app/core/reducers/theme';
import { LanguageModel, ProviderModel, WalletModel } from '@app/models';

export { WalletReducer, ProviderReducer, LanguageReducer, ThemeReducer };

export interface State {
  wallets: WalletModel[];
  providers: ProviderModel[];
  languages: LanguageModel[];
  theme: string;
}

export const reducers: ActionReducerMap<State> = {
  wallets: WalletReducer.reducer,
  providers: ProviderReducer.reducer,
  languages: LanguageReducer.reducer,
  theme: ThemeReducer.reducer,
};

export const metaReducers: MetaReducer<State>[] = !environment.production
  ? []
  : [];
