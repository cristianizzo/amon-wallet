// @typescript-eslint/naming-convention
import { createAction } from '@ngrx/store';
import { WalletModel } from '@app/models';
import { type } from '@app/core/util';

export const walletActionTypes = {
  initWallet: type('[Wallet] init wallet'),
  addWallet: type('[Wallet] add wallet'),
  updateStateWallet: type('[Wallet] update state wallet'),
  verifyPasswordWallet: type('[Wallet] verify password wallet'),
  connectWallet: type('[Wallet] connect wallet'),
  renameWallet: type('[Wallet] rename wallet'),
  deleteWallet: type('[Wallet] delete wallet'),
  getAllWallets: type('[Wallet] get all wallets'),
  getAllWalletsSuccess: type('[Wallet] get all wallets success'),
  resetWallets: type('[Wallet] reset wallets'),
};

export const initWallet = createAction(walletActionTypes.initWallet);

export const getAllWallets = createAction(walletActionTypes.getAllWallets);

export const getAllWalletsSuccess = createAction(
  walletActionTypes.getAllWalletsSuccess,
  (wallets: WalletModel[]) => ({ wallets })
);

export const resetWallets = createAction(walletActionTypes.resetWallets);

export const addWallet = createAction(
  walletActionTypes.addWallet,
  (wallet: WalletModel, secret: string) => ({ wallet, secret })
);

export const updateStateWallet = createAction(
  walletActionTypes.updateStateWallet,
  (wallet: WalletModel) => ({ wallet })
);

export const connectWallet = createAction(
  walletActionTypes.connectWallet,
  (address: string) => ({ address })
);

export const renameWallet = createAction(
  walletActionTypes.renameWallet,
  (address: string, name: string) => ({ address, name })
);

export const deleteWallet = createAction(
  walletActionTypes.deleteWallet,
  (address: string) => ({ address })
);
