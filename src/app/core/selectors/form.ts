import { createFeatureSelector, createSelector } from '@ngrx/store';
import { FormReducer } from '@app/core/reducers';

export const getFormState = createFeatureSelector<{ loading: boolean }>(
  FormReducer.featureKey
);
export const getLoading = createSelector(
  getFormState,
  (state: { loading: boolean }): { loading: boolean } => state
);
