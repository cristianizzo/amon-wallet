import { createAction } from '@ngrx/store';
import { ChainModel } from '@models/chain.model';
import { type } from '@app/core/util';

export const chainActionTypes = {
  initChain: type('[Chain] init chain'),
  updateStateChain: type('[Chain] update state chain'),
  addChain: type('[Chain] add chain'),
  switchChain: type('[Chain] switch chain'),
};

export const initChain = createAction(chainActionTypes.initChain);

export const updateStateChain = createAction(
  chainActionTypes.updateStateChain,
  (chain: ChainModel) => ({ chain })
);

export const addChain = createAction(
  chainActionTypes.addChain,
  (chain: ChainModel) => ({
    chain,
  })
);

export const switchChain = createAction(
  chainActionTypes.switchChain,
  (chain: ChainModel) => ({
    chain,
  })
);
