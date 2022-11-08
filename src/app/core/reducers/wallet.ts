import { WalletModel } from '@app/models';
import { Action, createReducer, on } from '@ngrx/store';
import { WalletActions } from '@app/core/actions';

export const featureKey = 'wallets';
const initialState: WalletModel[] = [];

export const walletReducer = createReducer(
  initialState,
  on(
    WalletActions.updateStateWallets,
    (_: WalletModel[] = initialState, { wallets }) => [...wallets]
  ),
  // on(WalletActions.deleteWallet, (state: WalletModel[] = initialState, {address}) =>
  //   state.filter(w => w.address !== address)
  // ),
  on(
    WalletActions.switchDefaultWallet,
    (state: WalletModel[] = initialState, { address }) => {
      const updatedState = state.map((w) =>
        Object.assign({}, w, {
          connected: w.address === address,
        })
      );

      return updatedState;
    }
  )
);

export const reducer = (
  state: WalletModel[] | undefined,
  action: Action
): any => walletReducer(state, action);
