import { createFeatureSelector, createSelector } from '@ngrx/store';
import { WalletModel } from '@app/models';
import { WalletReducer } from '@app/core/reducers';
import { UtilsHelper } from '@helpers/utils';

export const getWalletsState = createFeatureSelector<WalletModel[]>(
  WalletReducer.featureKey
);
export const getWallets = createSelector(
  getWalletsState,
  (state: WalletModel[]) => new UtilsHelper().sortWallets(state)
);
export const getWallet = createSelector(
  getWalletsState,
  (state: WalletModel[]) => state.find((w) => w.connected)
);
