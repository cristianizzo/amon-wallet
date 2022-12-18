import { createFeatureSelector, createSelector } from '@ngrx/store';
import { WalletModel } from '@app/models';
import { WalletReducer } from '@app/core/reducers';
import { WalletStateModel } from '@core/models';

export const getWalletState = createFeatureSelector<WalletStateModel>(
  WalletReducer.featureKey
);
export const getWallet = createSelector(
  getWalletState,
  (state: WalletStateModel): WalletModel => state.current
);

export const getAllWallets = createSelector(
  getWalletState,
  (state: WalletStateModel): WalletModel[] => state.all
);

export const getLoading = createSelector(
  getWalletState,
  (state: WalletStateModel): { loading: boolean; loadingBalance: boolean } => ({
    loading: state.loading,
    loadingBalance: state.loadingBalance,
  })
);
