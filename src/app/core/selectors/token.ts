import { createFeatureSelector, createSelector } from '@ngrx/store';
import { TokenModel } from '@app/models';
import { TokenReducer } from '@app/core/reducers';
import { TokenStateModel } from '@core/models';

export const getTokenState = createFeatureSelector<TokenStateModel>(
  TokenReducer.featureKey
);

export const getSelectedTokens = createSelector(
  getTokenState,
  (state: TokenStateModel): TokenModel[] =>
    state.current.filter((w) => w.selected)
);

export const getTokens = createSelector(
  getTokenState,
  (state: TokenStateModel): TokenModel[] => state.current
);

export const getAllTokens = createSelector(
  getTokenState,
  (state: TokenStateModel): TokenModel[] => state.all
);

export const getLoading = createSelector(
  getTokenState,
  (state: TokenStateModel): { loading: boolean; loadingBalances: boolean } => ({
    loading: state.loading,
    loadingBalances: state.loadingBalances,
  })
);
