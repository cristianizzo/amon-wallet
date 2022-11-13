import { environment } from '@env/environment';
import { ActionReducerMap, MetaReducer } from '@ngrx/store';
import * as WalletReducer from '@app/core/reducers/wallet';
import * as ProviderReducer from '@app/core/reducers/provider';
import * as LanguageReducer from '@app/core/reducers/language';
import * as ThemeReducer from '@app/core/reducers/theme';
import * as CurrencyReducer from '@app/core/reducers/currency';
import * as TokenReducer from '@app/core/reducers/token';
import { StateModel } from '@app/models';

export {
  WalletReducer,
  ProviderReducer,
  LanguageReducer,
  ThemeReducer,
  CurrencyReducer,
  TokenReducer,
};

export const reducers: ActionReducerMap<StateModel> = {
  wallets: WalletReducer.reducer,
  providers: ProviderReducer.reducer,
  currencies: CurrencyReducer.reducer,
  tokens: TokenReducer.reducer,
  languages: LanguageReducer.reducer,
  theme: ThemeReducer.reducer,
};

export const metaReducers: MetaReducer<StateModel>[] = !environment.production
  ? []
  : [];
