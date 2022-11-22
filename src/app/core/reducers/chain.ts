import { ChainModel } from '@app/models';
import { Action, createReducer, on } from '@ngrx/store';
import { ChainActions } from '@app/core/actions';

export const featureKey = 'chain';
const initialState: { current: ChainModel; all: ChainModel[] } = {
  current: null,
  all: [],
};

export const chainReducer = createReducer(
  initialState,
  on(ChainActions.updateStateChain, (state = initialState, { chain }) => ({
    ...state,
    ...{
      current: chain,
      all: state.all.map((c) =>
        Object.assign({}, c, {
          connected: c.rpc === chain.rpc,
        })
      ),
    },
  })),
  on(ChainActions.getAllChainsSuccess, (state = initialState, { chains }) => ({
    ...state,
    ...{ all: chains },
  })),
  on(ChainActions.resetChains, (state = initialState) => ({
    ...state,
    ...{ all: [] },
  }))
);

export const reducer = (state = initialState, action: Action): any =>
  chainReducer(state, action);
