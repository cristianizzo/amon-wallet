import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ThemeReducer } from '@app/core/reducers';

export const getThemeState = createFeatureSelector<string>(
  ThemeReducer.featureKey
);
export const getTheme = createSelector(
  getThemeState,
  (state: string): string => state
);
