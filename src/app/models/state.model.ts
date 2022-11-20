import {
  CurrencyModel,
  LanguageModel,
  ChainModel,
  TokenModel,
  WalletModel,
} from '@models/index';

export interface StateModel {
  readonly theme?: string;
  readonly tokens?: TokenModel[];
  readonly chain?: ChainModel;
  readonly wallet?: WalletModel;
  readonly currency?: CurrencyModel;
  readonly language?: LanguageModel;
  readonly form?: { loading: boolean };
}
