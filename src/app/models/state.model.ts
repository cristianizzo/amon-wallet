import {
  ChainModel,
  CurrencyModel,
  LanguageModel,
  TokenModel,
  WalletModel,
} from '@models/index';

export interface StateModel {
  theme?: string;
  tokens?: {
    current: TokenModel[];
    all: TokenModel[];
  };
  chain?: {
    current: ChainModel;
    all: ChainModel[];
  };
  wallet?: {
    current: WalletModel;
    all: WalletModel[];
  };
  currency?: {
    current: CurrencyModel;
    all: CurrencyModel[];
  };
  language?: LanguageModel;
  form?: { loading: boolean; topLoading: boolean };
}
