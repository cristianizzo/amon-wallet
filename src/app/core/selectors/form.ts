import { createFeatureSelector, createSelector } from '@ngrx/store';
import { FormReducer } from '@app/core/reducers';

export const getFormState = createFeatureSelector<{
  loading: boolean;
  topLoading: boolean;
}>(FormReducer.featureKey);
export const getLoading = createSelector(
  getFormState,
  (state: {
    loading: boolean;
    topLoading: boolean;
  }): { loading: boolean; topLoading: boolean } => state
);
