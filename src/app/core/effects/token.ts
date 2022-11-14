import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { TokenActions } from '@app/core/actions';
import { TokenService } from '@services/token.service';
import { ToastService } from '@services/toast.service';
import { ErrorService } from '@services/error.service';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import logger from '@app/app.logger';

const logContent = logger.logContent('core:effects:token');

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
      catchError((error) => {
        logger.error(
          logContent.add({
            info: `error init tokens`,
            error,
          })
        );
        return of(TokenActions.tokenError(error));
      })
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
        logger.error(
          logContent.add({
            info: `error add token`,
            error,
          })
        );
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
        logger.error(
          logContent.add({
            info: `error select token`,
            error,
          })
        );
        return of(TokenActions.tokenError(error));
      })
    )
  );

  unselectToken$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TokenActions.unselectToken),
      switchMap((action) =>
        this.tokenService
          .unselectToken(action.address, action.provider)
          .pipe(map((token) => TokenActions.updateTokenToState(token)))
      ),
      catchError((error) => {
        logger.error(
          logContent.add({
            info: `error unselect token`,
            error,
          })
        );
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
