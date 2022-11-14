import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ProviderModel, WalletModel } from '@app/models';
import { ProviderReducer } from '@app/core/reducers';
import { UtilsHelper } from '@helpers/utils';
import { getWalletsState } from '@app/core/selectors/wallet';

export const getProviderState = createFeatureSelector<ProviderModel[]>(
  ProviderReducer.featureKey
);
export const getProviders = createSelector(
  getProviderState,
  (state: ProviderModel[]): ProviderModel[] =>
    new UtilsHelper().sortByProp(state, 'default')
);

export const getProvider = createSelector(
  getProviderState,
  (state: ProviderModel[]): ProviderModel =>
    state ? state.find((w) => w.default) : null
);
