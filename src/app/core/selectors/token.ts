import { createFeatureSelector, createSelector } from '@ngrx/store';
import { TokenModel } from '@app/models';
import { TokenReducer } from '@app/core/reducers';

export const getTokenState = createFeatureSelector<TokenModel[]>(
  TokenReducer.featureKey
);
export const getDefaultTokens = createSelector(
  getTokenState,
  (state: TokenModel[]): TokenModel[] =>
    state ? state.filter((w) => !w.selected) : null
);
export const getSelectedToken = createSelector(
  getTokenState,
  (state: TokenModel[]): TokenModel[] =>
    state ? state.filter((w) => w.selected) : null
);
