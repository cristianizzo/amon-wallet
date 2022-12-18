import { WalletStateModel } from '@core/models';
import { Action, createReducer, on } from '@ngrx/store';
import { WalletActions } from '@app/core/actions';

export const featureKey = 'wallet';
const initialState: WalletStateModel = {
  loadingBalance: false,
  loading: false,
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
  on(
    WalletActions.deleteWalletFromState,
    (state = initialState, { address }) => ({
      ...state,
      ...{ all: state.all.filter((w) => w.address !== address) },
    })
  ),
  on(WalletActions.resetWallets, (state = initialState) => ({
    ...state,
    ...{ all: [] },
  })),
  on(
    WalletActions.setLoading,
    (state = initialState, { loading, loadingBalance }) => ({
      ...state,
      ...{
        loading,
        loadingBalance,
      },
    })
  )
);

export const reducer = (state = initialState, action: Action): any =>
  walletReducer(state, action);
