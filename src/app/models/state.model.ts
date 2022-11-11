import {
  CurrencyModel,
  LanguageModel,
  ProviderModel,
  TokenModel,
  WalletModel,
} from '@models/index';

export interface StateModel {
  readonly theme?: string;
  readonly tokens?: TokenModel[];
  readonly providers?: ProviderModel[];
  readonly wallets?: WalletModel[];
  readonly currencies?: CurrencyModel[];
  readonly languages?: LanguageModel[];
}
