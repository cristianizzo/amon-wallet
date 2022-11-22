import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CurrencyModel } from '@app/models';
import { CurrencyReducer } from '@app/core/reducers';

export const getCurrencyState = createFeatureSelector<{
  current: CurrencyModel;
  all: CurrencyModel[];
}>(CurrencyReducer.featureKey);

export const getCurrency = createSelector(
  getCurrencyState,
  (state: { current: CurrencyModel; all: CurrencyModel[] }): CurrencyModel =>
    state.current
);

export const getAllCurrencies = createSelector(
  getCurrencyState,
  (state: { current: CurrencyModel; all: CurrencyModel[] }): CurrencyModel[] =>
    state.all
);
