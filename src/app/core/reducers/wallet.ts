import { WalletModel } from '@app/models';
import { Action, createReducer, on } from '@ngrx/store';
import { WalletActions } from '@app/core/actions';

export const featureKey = 'wallet';
const initialState: WalletModel = null;

export const walletReducer = createReducer(
  initialState,
  on(
    WalletActions.updateStateWallet,
    (_: WalletModel = initialState, { wallet }) => wallet
  )
);

export const reducer = (state: WalletModel | undefined, action: Action): any =>
  walletReducer(state, action);
