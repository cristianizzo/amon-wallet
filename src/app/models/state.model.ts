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
  readonly currencies?: CurrencyModel[];
  readonly language?: LanguageModel;
  readonly form?: { loading: boolean };
}
