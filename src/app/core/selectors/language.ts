import { createFeatureSelector, createSelector } from '@ngrx/store';
import { LanguageModel } from '@app/models';
import { LanguageReducer } from '@app/core/reducers';

export const getLanguageState = createFeatureSelector<LanguageModel[]>(
  LanguageReducer.featureKey
);
export const getLanguages = createSelector(
  getLanguageState,
  (state: LanguageModel[]): LanguageModel[] => state
);
export const getLanguage = createSelector(
  getLanguageState,
  (state: LanguageModel[]): LanguageModel =>
    state ? state.find((w) => w.selected) : null
);
