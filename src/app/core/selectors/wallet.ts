import { createFeatureSelector, createSelector } from '@ngrx/store';
import { WalletModel } from '@app/models';
import { WalletReducer } from '@app/core/reducers';

export const getWalletState = createFeatureSelector<{
  current: WalletModel;
  all: WalletModel[];
}>(WalletReducer.featureKey);
export const getWallet = createSelector(
  getWalletState,
  (state: { current: WalletModel; all: WalletModel[] }): WalletModel =>
    state.current
);

export const getAllWallets = createSelector(
  getWalletState,
  (state: { current: WalletModel; all: WalletModel[] }): WalletModel[] =>
    state.all
);
