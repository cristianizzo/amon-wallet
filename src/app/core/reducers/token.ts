import { TokenModel } from '@app/models';
import { Action, createReducer, on } from '@ngrx/store';
import { TokenActions } from '@app/core/actions';

export const featureKey = 'tokens';
const initialState: TokenModel[] = [];

export const tokenReducer = createReducer(
  initialState,
  on(
    TokenActions.updateStateTokens,
    (_: TokenModel[] = initialState, { tokens }) => tokens
  ),
  on(
    TokenActions.addTokenToState,
    (state: TokenModel[] = initialState, { token }) => [...state, token]
  ),
  on(
    TokenActions.updateTokenToState,
    (state: TokenModel[] = initialState, { token }) => {
      const updatedState = state.map((tk) => {
        if (tk.address === token.address) {
          return Object.assign({}, tk, token);
        }
        return tk;
      });
      return updatedState;
    }
  ),
  on(TokenActions.resetState, (_state: TokenModel[] = initialState) => [])
);

export const reducer = (state: TokenModel[] | undefined, action: Action): any =>
  tokenReducer(state, action);
