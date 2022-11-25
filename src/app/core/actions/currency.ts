import { createAction } from '@ngrx/store';
import { CurrencyModel } from '@models/currency.model';
import { type } from '@app/core/util';

export const currencyActionTypes = {
  updateStateCurrency: type('[Currency] update state currency'),
  switchCurrency: type('[Currency] switch currency'),
  getAllCurrencies: type('[Currency] get all currencies'),
  getAllCurrenciesSuccess: type('[Currency] get all currencies success'),
  setLoading: type('[Currency] set loading'),
  resetCurrencies: type('[Currency] reset currencies'),
};

export const getAllCurrencies = createAction(
  currencyActionTypes.getAllCurrencies
);

export const getAllCurrenciesSuccess = createAction(
  currencyActionTypes.getAllCurrenciesSuccess,
  (currencies: CurrencyModel[]) => ({ currencies })
);

export const resetCurrencies = createAction(
  currencyActionTypes.resetCurrencies
);

export const updateStateCurrency = createAction(
  currencyActionTypes.updateStateCurrency,
  (currency: CurrencyModel) => ({ currency })
);

export const switchCurrency = createAction(
  currencyActionTypes.switchCurrency,
  (currency: CurrencyModel) => ({ currency })
);

export const setLoading = createAction(
  currencyActionTypes.setLoading,
  (loading: boolean) => ({ loading })
);
