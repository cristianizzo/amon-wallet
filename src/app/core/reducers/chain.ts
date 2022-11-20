import { ChainModel } from '@app/models';
import { Action, createReducer, on } from '@ngrx/store';
import { ChainActions } from '@app/core/actions';

export const featureKey = 'chain';
const initialState: ChainModel = null;

export const chainReducer = createReducer(
  initialState,
  on(
    ChainActions.updateStateChain,
    (_state: ChainModel = initialState, { chain }) => chain
  )
);

export const reducer = (state: ChainModel | undefined, action: Action): any =>
  chainReducer(state, action);
