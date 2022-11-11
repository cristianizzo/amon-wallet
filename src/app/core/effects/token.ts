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

  addToken$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TokenActions.addToken),
      switchMap((action) =>
        this.tokenService
          .addToken(action.token, action.wallet)
          .pipe(map((token) => TokenActions.addTokenToState(token)))
      ),
      catchError((error) => of(TokenActions.tokenError(error)))
    )
  );

  constructor(
    private actions$: Actions,
    private tokenService: TokenService,
    private toastService: ToastService,
    private errorService: ErrorService
  ) {}
}
