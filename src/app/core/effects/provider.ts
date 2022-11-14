import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ProviderActions, TokenActions } from '@app/core/actions';
import { ProviderService } from '@services/providers.service';
import { ToastService } from '@services/toast.service';
import { ErrorService } from '@services/error.service';
import { of } from 'rxjs';
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';
import logger from '@app/app.logger';

const logContent = logger.logContent('core:effects:provider');

@Injectable()
export class ProviderEffects {
  initProviders$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProviderActions.initProviders),
      switchMap((_) =>
        this.providerService
          .initProviders()
          .pipe(
            map((providers) => ProviderActions.updateStateProviders(providers))
          )
      ),
      catchError((error) => {
        logger.error(
          logContent.add({
            info: `error init providers`,
            error,
          })
        );
        return of(ProviderActions.providerError(error));
      })
    )
  );

  switchProvider$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProviderActions.switchProvider),
      switchMap((action) =>
        this.providerService.switchProvider(action.provider).pipe(
          mergeMap((providers) => [
            TokenActions.resetState(),
            ProviderActions.updateStateProviders(providers),
            TokenActions.initTokens(
              action.provider,
              action.currency,
              action.wallet
            ),
          ]),
          catchError((error) => {
            logger.error(
              logContent.add({
                info: `error switch provider`,
                error,
              })
            );
            return of(ProviderActions.providerError(error));
          })
        )
      )
    )
  );

  error$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ProviderActions.providerError),
        map(({ error }) => {
          this.toastService.responseError(this.errorService.parseError(error));
        })
      ),
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private providerService: ProviderService,
    private toastService: ToastService,
    private errorService: ErrorService
  ) {}
}
