import { NetworkModel } from '@app/models';
import { Action, createReducer, on } from '@ngrx/store';
import { NetworkActions } from '@app/core/actions';

export const featureKey = 'networks';
const initialState: NetworkModel[] = [];

export const networkReducer = createReducer(
  initialState,
  on(
    NetworkActions.updateStateNetworks,
    (_state: NetworkModel[] = initialState, { networks }) => networks
  )
);

export const reducer = (
  state: NetworkModel[] | undefined,
  action: Action
): any => networkReducer(state, action);
