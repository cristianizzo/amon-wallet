import { createFeatureSelector, createSelector } from '@ngrx/store';
import { WalletModel } from '@app/models';
import { WalletReducer } from '@app/core/reducers';

export const getWalletState = createFeatureSelector<WalletModel>(
  WalletReducer.featureKey
);
export const getWallet = createSelector(
  getWalletState,
  (state: WalletModel): WalletModel => state
);
