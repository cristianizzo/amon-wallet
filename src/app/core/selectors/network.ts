import { createFeatureSelector, createSelector } from '@ngrx/store';
import { NetworkModel, WalletModel } from '@app/models';
import { NetworkReducer } from '@app/core/reducers';
import { UtilsHelper } from '@helpers/utils';

export const getNetworkState = createFeatureSelector<NetworkModel[]>(
  NetworkReducer.featureKey
);
export const getNetworks = createSelector(
  getNetworkState,
  (state: NetworkModel[]): NetworkModel[] =>
    new UtilsHelper().sortByProp(state, 'default')
);

export const getNetwork = createSelector(
  getNetworkState,
  (state: NetworkModel[]): NetworkModel =>
    state ? state.find((w) => w.default) : null
);
