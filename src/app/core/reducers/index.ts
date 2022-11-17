import { environment } from '@env/environment';
import { ActionReducerMap, MetaReducer } from '@ngrx/store';
import * as WalletReducer from '@app/core/reducers/wallet';
import * as NetworkReducer from '@app/core/reducers/network';
import * as LanguageReducer from '@app/core/reducers/language';
import * as ThemeReducer from '@app/core/reducers/theme';
import * as CurrencyReducer from '@app/core/reducers/currency';
import * as TokenReducer from '@app/core/reducers/token';
import * as FormReducer from '@app/core/reducers/form';
import { StateModel } from '@app/models';

export {
  WalletReducer,
  NetworkReducer,
  LanguageReducer,
  ThemeReducer,
  CurrencyReducer,
  TokenReducer,
  FormReducer,
};

export const reducers: ActionReducerMap<StateModel> = {
  wallets: WalletReducer.reducer,
  networks: NetworkReducer.reducer,
  currencies: CurrencyReducer.reducer,
  tokens: TokenReducer.reducer,
  languages: LanguageReducer.reducer,
  theme: ThemeReducer.reducer,
  form: FormReducer.reducer,
};

export const metaReducers: MetaReducer<StateModel>[] = !environment.production
  ? []
  : [];
