import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ProviderModel } from '@app/models';
import { ProviderReducer } from '@app/core/reducers';

export const getProviderState = createFeatureSelector<ProviderModel[]>(
  ProviderReducer.featureKey
);
export const getProviders = createSelector(
  getProviderState,
  (state: ProviderModel[]): ProviderModel[] => state
);
export const getProvider = createSelector(
  getProviderState,
  (state: ProviderModel[]): ProviderModel =>
    state ? state.find((w) => w.default) : null
);
