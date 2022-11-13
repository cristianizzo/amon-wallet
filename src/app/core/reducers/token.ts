import { TokenModel } from '@app/models';
import { Action, createReducer, on } from '@ngrx/store';
import { TokenActions } from '@app/core/actions';

export const featureKey = 'tokens';
const initialState: TokenModel[] = [];

export const tokenReducer = createReducer(
  initialState,
  on(
    TokenActions.updateStateTokens,
    (state: TokenModel[] = initialState, { tokens }) => [...state, ...tokens]
  ),
  on(
    TokenActions.addTokenToState,
    (state: TokenModel[] = initialState, { token }) => [...state, token]
  ),
  on(
    TokenActions.updateTokenToState,
    (state: TokenModel[] = initialState, { token }) => {
      const updatedState = state.map((tk) => Object.assign({}, tk, token));
      return updatedState;
    }
  )
);

export const reducer = (state: TokenModel[] | undefined, action: Action): any =>
  tokenReducer(state, action);
