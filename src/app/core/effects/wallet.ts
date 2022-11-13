import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';
import { WalletActions } from '@app/core/actions';
import { WalletService } from '@services/wallet.service';
import { ErrorService } from '@services/error.service';
import { ToastService } from '@app/services/toast.service';

@Injectable()
export class WalletEffects {
  initWallets$ = createEffect(() =>
    this.actions$.pipe(
      ofType(WalletActions.initWallets),
      mergeMap(() => this.walletService.initWallets()),
      switchMap((w) =>
        this.walletService
          .fetchBalances(w)
          .pipe(map((wallets) => WalletActions.updateStateWallets(wallets)))
      ),
      catchError((error) => {
        console.log('walletError', error);
        return of(WalletActions.walletError(error));
      })
    )
  );

  addWallet$ = createEffect(() =>
    this.actions$.pipe(
      ofType(WalletActions.addWallet),
      mergeMap(({ wallet, secret }) =>
        this.walletService.addWallet({ wallet, secret })
      ),
      switchMap((w) =>
        this.walletService
          .fetchBalances(w)
          .pipe(
            map((wallets: any) => WalletActions.updateStateWallets(wallets))
          )
      ),
      catchError((error) => of(WalletActions.walletError(error)))
    )
  );

  renameWallet$ = createEffect(() =>
    this.actions$.pipe(
      ofType(WalletActions.renameWallet),
      mergeMap(({ address, name }) =>
        this.walletService.renameWallet({ address, name })
      ),
      switchMap((w) =>
        this.walletService
          .fetchBalances(w)
          .pipe(map((wallets) => WalletActions.updateStateWallets(wallets)))
      ),
      catchError((error) => of(WalletActions.walletError(error)))
    )
  );

  error$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(WalletActions.walletError),
        map(({ error }) => {
          this.toastService.responseError(this.errorService.parseError(error));
        })
      ),
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private walletService: WalletService,
    private errorService: ErrorService,
    private toastService: ToastService
  ) {}
}
