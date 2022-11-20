import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ChainModel } from '@app/models';
import { ChainReducer } from '@app/core/reducers';

export const getChainState = createFeatureSelector<ChainModel>(
  ChainReducer.featureKey
);

export const getChain = createSelector(
  getChainState,
  (state: ChainModel): ChainModel => state
);
