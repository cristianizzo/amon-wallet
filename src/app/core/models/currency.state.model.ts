import { CurrencyModel } from '@app/models';

export interface CurrencyStateModel {
  loading: boolean;
  current: CurrencyModel;
  all: CurrencyModel[];
}
