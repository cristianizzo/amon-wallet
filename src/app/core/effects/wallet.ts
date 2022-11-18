import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { FormActions, WalletActions } from '@app/core/actions';
import { WalletService } from '@services/wallet.service';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import logger from '@app/app.logger';

const logContent = logger.logContent('core:effects:wallet');

@Injectable()
export class WalletEffects {
  initWallets$ = createEffect(() =>
    this.actions$.pipe(
      ofType(WalletActions.initWallets),
      switchMap(() => this.walletService.initWallets()),
      map((wallets) => WalletActions.updateStateWallets(wallets)),
      catchError((error) => {
        logger.error(
          logContent.add({
            info: `error init wallets`,
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
        this.walletService.addWallet({ wallet, secret })
      ),
      map((wallets) => WalletActions.updateStateWallets(wallets)),
      catchError((error) => {
        logger.error(
          logContent.add({
            info: `error init wallets`,
            error,
          })
        );
        return of(FormActions.formError(error));
      })
    )
  );

  deleteWallet$ = createEffect(() =>
    this.actions$.pipe(
      ofType(WalletActions.deleteWallet),
      mergeMap(({ address }) => this.walletService.deleteWallet({ address })),
      switchMap((w) =>
        this.walletService
          .fetchBalances(w)
          .pipe(map((wallets) => WalletActions.updateStateWallets(wallets)))
      ),
      catchError((error) => {
        logger.error(
          logContent.add({
            info: `error init wallets`,
            error,
          })
        );
        return of(WalletActions.walletError(error));
      })
    )
  );

  renameWallet$ = createEffect(() =>
    this.actions$.pipe(
      ofType(WalletActions.renameWallet),
      switchMap(({ address, name }) =>
        this.walletService.renameWallet({ address, name })
      ),
      map((wallets) => WalletActions.updateStateWallets(wallets)),
      catchError((error) => {
        logger.error(
          logContent.add({
            info: `error init wallets`,
            error,
          })
        );
        return of(FormActions.formError(error));
      })
    )
  );

  constructor(
    private actions$: Actions,
    private walletService: WalletService
  ) {}
}
