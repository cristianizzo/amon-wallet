import {
  ChainStateModel,
  CurrencyStateModel,
  FormStateModel,
  TokenStateModel,
  WalletStateModel,
} from '@app/core/models';
import { LanguageModel } from '@models/index';

export interface StateModel {
  theme?: string;
  tokens?: TokenStateModel;
  chain?: ChainStateModel;
  wallet?: WalletStateModel;
  currency?: CurrencyStateModel;
  language?: LanguageModel;
  form?: FormStateModel;
}
