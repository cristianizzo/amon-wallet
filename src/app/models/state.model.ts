import {
  CurrencyModel,
  LanguageModel,
  NetworkModel,
  TokenModel,
  WalletModel,
} from '@models/index';

export interface StateModel {
  readonly theme?: string;
  readonly tokens?: TokenModel[];
  readonly networks?: NetworkModel[];
  readonly wallets?: WalletModel[];
  readonly currencies?: CurrencyModel[];
  readonly languages?: LanguageModel[];
  readonly form?: { loading: boolean };
}
