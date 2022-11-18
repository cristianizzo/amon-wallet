import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CurrencyModel, LanguageModel } from '@app/models';
import { CurrencyReducer, LanguageReducer } from '@app/core/reducers';

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
    state ? state.find((w) => w.selected) : null
);
