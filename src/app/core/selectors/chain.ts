import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ChainModel } from '@app/models';
import { ChainReducer } from '@app/core/reducers';

export const getChainState = createFeatureSelector<{
  current: ChainModel;
  all: ChainModel[];
}>(ChainReducer.featureKey);

export const getChain = createSelector(
  getChainState,
  (state: { current: ChainModel; all: ChainModel[] }): ChainModel =>
    state.current
);

export const getAllChains = createSelector(
  getChainState,
  (state: { current: ChainModel; all: ChainModel[] }): ChainModel[] => state.all
);
