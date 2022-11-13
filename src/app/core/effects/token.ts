import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { TokenActions } from '@app/core/actions';
import { TokenService } from '@services/token.service';
import { ToastService } from '@services/toast.service';
import { ErrorService } from '@services/error.service';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

@Injectable()
export class TokenEffects {
  initTokens$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TokenActions.initTokens),
      switchMap((action) =>
        this.tokenService
          .initTokens(action.provider, action.currency, action.wallet)
          .pipe(map((tokens) => TokenActions.updateStateTokens(tokens)))
      ),
      catchError((error) => of(TokenActions.tokenError(error)))
    )
  );

  addToken$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TokenActions.addToken),
      switchMap((action) =>
        this.tokenService
          .addToken(
            action.address,
            action.wallet,
            action.provider,
            action.currency
          )
          .pipe(map((token) => TokenActions.addTokenToState(token)))
      ),
      catchError((error) => {
        console.log('tokenError', error);
        return of(TokenActions.tokenError(error));
      })
    )
  );

  selectToken$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TokenActions.selectToken),
      switchMap((action) =>
        this.tokenService
          .selectToken(
            action.address,
            action.wallet,
            action.provider,
            action.currency
          )
          .pipe(map((token) => TokenActions.updateTokenToState(token)))
      ),
      catchError((error) => {
        console.log('selectToken error', error);
        return of(TokenActions.tokenError(error));
      })
    )
  );

  unselectToken$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TokenActions.unselectToken),
      switchMap((action) =>
        this.tokenService
          .unselectToken(action.address)
          .pipe(map((token) => TokenActions.updateTokenToState(token)))
      ),
      catchError((error) => {
        console.log('unselectToken error', error);
        return of(TokenActions.tokenError(error));
      })
    )
  );

  error$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(TokenActions.tokenError),
        map(({ error }) => {
          this.toastService.responseError(this.errorService.parseError(error));
        })
      ),
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private tokenService: TokenService,
    private toastService: ToastService,
    private errorService: ErrorService
  ) {}
}
