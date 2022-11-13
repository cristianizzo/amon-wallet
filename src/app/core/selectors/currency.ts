import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CurrencyModel } from '@app/models';
import { CurrencyReducer } from '@app/core/reducers';

export const getCurrencyState = createFeatureSelector<CurrencyModel[]>(
  CurrencyReducer.featureKey
);
export const getCurrencies = createSelector(
  getCurrencyState,
  (state: CurrencyModel[]): CurrencyModel[] => state
);
export const getCurrency = createSelector(
  getCurrencyState,
  (state: CurrencyModel[]): CurrencyModel =>
    state ? state.find((w) => w.default) : null
);
