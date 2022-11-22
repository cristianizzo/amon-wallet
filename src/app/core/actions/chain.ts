import { createAction } from '@ngrx/store';
import { ChainModel } from '@models/chain.model';
import { type } from '@app/core/util';

export const chainActionTypes = {
  updateStateChain: type('[Chain] update state chain'),
  addChain: type('[Chain] add chain'),
  switchChain: type('[Chain] switch chain'),
  getAllChains: type('[Chain] get all chains'),
  getAllChainsSuccess: type('[Chain] get all chains success'),
  resetChains: type('[Chain] reset chains'),
};

export const getAllChains = createAction(chainActionTypes.getAllChains);

export const getAllChainsSuccess = createAction(
  chainActionTypes.getAllChainsSuccess,
  (chains: ChainModel[]) => ({ chains })
);

export const resetChains = createAction(chainActionTypes.resetChains);

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
