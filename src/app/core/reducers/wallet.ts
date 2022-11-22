import { WalletModel } from '@app/models';
import { Action, createReducer, on } from '@ngrx/store';
import { WalletActions } from '@app/core/actions';

export const featureKey = 'wallet';
const initialState: { current: WalletModel; all: WalletModel[] } = {
  current: null,
  all: [],
};

export const walletReducer = createReducer(
  initialState,
  on(WalletActions.updateStateWallet, (state = initialState, { wallet }) => ({
    ...state,
    ...{
      current: wallet,
      all: state.all.map((w) =>
        Object.assign({}, w, {
          connected: w.address === wallet.address,
        })
      ),
    },
  })),
  on(
    WalletActions.getAllWalletsSuccess,
    (state = initialState, { wallets }) => ({ ...state, ...{ all: wallets } })
  ),
  on(WalletActions.resetWallets, (state = initialState) => ({
    ...state,
    ...{ all: [] },
  }))
);

export const reducer = (state = initialState, action: Action): any =>
  walletReducer(state, action);
