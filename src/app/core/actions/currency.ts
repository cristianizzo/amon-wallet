import { createAction } from '@ngrx/store';
import { CurrencyModel } from '@models/currency.model';
import { type } from '@app/core/util';

export const currencyActionTypes = {
  initCurrency: type('[Currency] init currency'),
  updateStateCurrencies: type('[Currency] update state currencies'),
  switchCurrency: type('[Currency] switch currency'),
};

export const initCurrencies = createAction(currencyActionTypes.initCurrency);

export const updateStateCurrencies = createAction(
  currencyActionTypes.updateStateCurrencies,
  (currencies: CurrencyModel[]) => ({ currencies })
);

export const switchCurrency = createAction(
  currencyActionTypes.switchCurrency,
  (currency: CurrencyModel) => ({ currency })
);
