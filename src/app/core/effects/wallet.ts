import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { FormActions, WalletActions } from '@app/core/actions';
import { WalletProxy } from '@services/proxy/wallet.proxy';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import logger from '@app/app.logger';

const logContent = logger.logContent('core:effects:wallet');

@Injectable()
export class WalletEffects {
  initWallet$ = createEffect(() =>
    this.actions$.pipe(
      ofType(WalletActions.initWallet),
      switchMap(() => this.walletProxy.initWallet()),
      map((wallet) => WalletActions.updateStateWallet(wallet)),
      catchError((error) => {
        logger.error(
          logContent.add({
            info: `error init wallet`,
            error,
          })
        );
        return of(FormActions.formError(error));
      })
    )
  );

  addWallet$ = createEffect(() =>
    this.actions$.pipe(
      ofType(WalletActions.addWallet),
      switchMap(({ wallet, secret }) =>
        this.walletProxy.addWallet({ wallet, secret })
      ),
      map((wallet) => WalletActions.updateStateWallet(wallet)),
      catchError((error) => {
        logger.error(
          logContent.add({
            info: `error add wallet`,
            error,
          })
        );
        return of(FormActions.formError(error));
      })
    )
  );

  connectWallet$ = createEffect(() =>
    this.actions$.pipe(
      ofType(WalletActions.connectWallet),
      switchMap(({ address }) =>
        this.walletProxy.switchWalletAndFetchBalance({ address })
      ),
      map((wallet) => WalletActions.updateStateWallet(wallet)),
      catchError((error) => {
        logger.error(
          logContent.add({
            info: `error connect wallet`,
            error,
          })
        );
        return of(FormActions.formError(error));
      })
    )
  );

  deleteWallet$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(WalletActions.deleteWallet),
        switchMap(({ address }) => this.walletProxy.deleteWallet({ address })),
        catchError((error) => {
          logger.error(
            logContent.add({
              info: `error init wallet`,
              error,
            })
          );
          return of(FormActions.formError(error));
        })
      ),
    { dispatch: false }
  );

  renameWallet$ = createEffect(() =>
    this.actions$.pipe(
      ofType(WalletActions.renameWallet),
      switchMap(({ address, name }) =>
        this.walletProxy.renameWallet({ address, name })
      ),
      map((wallet) => WalletActions.updateStateWallet(wallet)),
      catchError((error) => {
        logger.error(
          logContent.add({
            info: `error rename wallets`,
            error,
          })
        );
        return of(FormActions.formError(error));
      })
    )
  );

  constructor(private actions$: Actions, private walletProxy: WalletProxy) {}
}
