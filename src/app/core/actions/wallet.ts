// @typescript-eslint/naming-convention
import { createAction } from '@ngrx/store';
import { WalletModel } from '@app/models';
import { type } from '@app/core/util';

export const walletActionTypes = {
  initWallets: type('[Wallet] init wallets'),
  addWallet: type('[Wallet] add wallet'),
  updateStateWallets: type('[Wallet] update state wallet'),
  verifyPasswordWallet: type('[Wallet] verify password wallet'),
  connectWallet: type('[Wallet] connect wallet'),
  renameWallet: type('[Wallet] rename wallet'),
};

export const initWallets = createAction(walletActionTypes.initWallets);

export const addWallet = createAction(
  walletActionTypes.addWallet,
  (wallet: WalletModel, secret: string) => ({ wallet, secret })
);

export const updateStateWallets = createAction(
  walletActionTypes.updateStateWallets,
  (wallets: WalletModel[]) => ({ wallets })
);

export const connectWallet = createAction(
  walletActionTypes.connectWallet,
  (address: string) => ({ address })
);

export const renameWallet = createAction(
  walletActionTypes.renameWallet,
  (address: string, name: string) => ({ address, name })
);
