import { Injectable } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { FormActions, WalletActions } from '@app/core/actions';
import { WalletProxy } from '@services/proxy/wallet.proxy';
import { of } from 'rxjs';
import { catchError, exhaustMap, map, switchMap, tap } from 'rxjs/operators';
import logger from '@app/app.logger';
import { WalletSelector } from '@core/selectors';
import { Store } from '@ngrx/store';
import { StateModel } from '@app/models';

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

  getAllWallets$ = createEffect(() =>
    this.actions$.pipe(
      ofType(WalletActions.getAllWallets),
      tap(() =>
        this.store.dispatch(FormActions.formStart({ topLoading: true }))
      ),
      concatLatestFrom(() => [this.store.select(WalletSelector.getWallet)]),
      exhaustMap(([_, wallet]) => this.walletProxy.getAllWallets(wallet)),
      map((wallets) => WalletActions.getAllWalletsSuccess(wallets)),
      tap(() => this.store.dispatch(FormActions.formEnd())),
      catchError((error) => {
        logger.error(
          logContent.add({
            info: `error get all wallets`,
            error,
          })
        );
        return of(FormActions.formError(error));
      })
    )
  );

  loadBalance$ = createEffect(() =>
    this.actions$.pipe(
      ofType(WalletActions.loadBalance),
      tap(() => [this.store.dispatch(WalletActions.setLoading(false, true))]),
      concatLatestFrom(() => [this.store.select(WalletSelector.getWallet)]),
      exhaustMap(([_, wallet]) => this.walletProxy.loadBalance(wallet)),
      map((wallets) => WalletActions.updateStateWallet(wallets)),
      tap(() => [this.store.dispatch(WalletActions.setLoading(false, false))])
    )
  );

  addWallet$ = createEffect(() =>
    this.actions$.pipe(
      ofType(WalletActions.addWallet),
      tap(() =>
        this.store.dispatch(
          FormActions.formStart({ loading: true, topLoading: true })
        )
      ),
      switchMap(({ wallet, secret }) =>
        this.walletProxy.addWallet({ wallet, secret })
      ),
      map((wallet) => WalletActions.updateStateWallet(wallet)),
      tap(() => this.store.dispatch(FormActions.formEnd())),
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
      tap(() =>
        this.store.dispatch(FormActions.formStart({ topLoading: true }))
      ),
      switchMap(({ address }) =>
        this.walletProxy.switchWalletAndFetchBalance({ address })
      ),
      map((wallet) => WalletActions.updateStateWallet(wallet)),
      tap(() => this.store.dispatch(FormActions.formEnd())),
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
        tap(() =>
          this.store.dispatch(
            FormActions.formStart({ loading: true, topLoading: true })
          )
        ),
        switchMap(({ address }) => this.walletProxy.deleteWallet({ address })),
        map((wallet) => WalletActions.deleteWalletFromState(wallet.address)),
        tap(() => this.store.dispatch(FormActions.formEnd())),
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
      tap(() =>
        this.store.dispatch(FormActions.formStart({ topLoading: true }))
      ),
      switchMap(({ address, name }) =>
        this.walletProxy.renameWallet({ address, name })
      ),
      map((wallet) => WalletActions.updateStateWallet(wallet)),
      tap(() => this.store.dispatch(FormActions.formEnd())),
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

  constructor(
    private actions$: Actions,
    private walletProxy: WalletProxy,
    private store: Store<StateModel>
  ) {}
}
