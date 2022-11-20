import { createAction } from '@ngrx/store';
import { CurrencyModel } from '@models/currency.model';
import { type } from '@app/core/util';

export const currencyActionTypes = {
  initCurrency: type('[Currency] init currency'),
  updateStateCurrency: type('[Currency] update state currency'),
  switchCurrency: type('[Currency] switch currency'),
};

export const initCurrency = createAction(currencyActionTypes.initCurrency);

export const updateStateCurrency = createAction(
  currencyActionTypes.updateStateCurrency,
  (currency: CurrencyModel) => ({ currency })
);

export const switchCurrency = createAction(
  currencyActionTypes.switchCurrency,
  (currency: CurrencyModel) => ({ currency })
);
