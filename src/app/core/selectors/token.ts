import { createFeatureSelector, createSelector } from '@ngrx/store';
import { TokenModel } from '@app/models';
import { TokenReducer } from '@app/core/reducers';

export const getTokenState = createFeatureSelector<{
  current: TokenModel[];
  all: TokenModel[];
}>(TokenReducer.featureKey);

export const getSelectedTokens = createSelector(
  getTokenState,
  (state: { current: TokenModel[]; all: TokenModel[] }): TokenModel[] =>
    state.current.filter((w) => w.selected)
);

export const getTokens = createSelector(
  getTokenState,
  (state: { current: TokenModel[]; all: TokenModel[] }): TokenModel[] =>
    state.current
);

export const getAllTokens = createSelector(
  getTokenState,
  (state: { current: TokenModel[]; all: TokenModel[] }): TokenModel[] =>
    state.all
);
