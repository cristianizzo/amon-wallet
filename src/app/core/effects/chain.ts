import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { FormActions, ChainActions, TokenActions } from '@app/core/actions';
import { ChainProxy } from '@services/proxy/chain.proxy';
import { of } from 'rxjs';
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';
import logger from '@app/app.logger';
import { Store } from '@ngrx/store';
import { StateModel } from '@app/models';

const logContent = logger.logContent('core:effects:chain');

@Injectable()
export class ChainEffects {
  initChain$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ChainActions.initChain),
      switchMap((_) => this.chainProxy.initChain()),
      map((chain) => ChainActions.updateStateChain(chain)),
      catchError((error) => {
        logger.error(
          logContent.add({
            info: `error init chain`,
            error,
          })
        );
        return of(FormActions.formError(error));
      })
    )
  );

  addChain$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ChainActions.addChain),
      switchMap((action) =>
        this.chainProxy.addCustomChain(action.chain).pipe(
          mergeMap((chain) => [
            TokenActions.resetState(),
            ChainActions.updateStateChain(chain),
            TokenActions.initTokens(),
          ]),
          catchError((error) => {
            logger.error(
              logContent.add({
                info: `error add chain`,
                error,
              })
            );
            return of(FormActions.formError(error));
          })
        )
      )
    )
  );

  switchChain$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ChainActions.switchChain),
      switchMap((action) =>
        this.chainProxy.switchChain(action.chain).pipe(
          mergeMap((chain) => [
            TokenActions.resetState(),
            ChainActions.updateStateChain(chain),
            TokenActions.initTokens(),
          ]),
          catchError((error) => {
            logger.error(
              logContent.add({
                info: `error switch chain`,
                error,
              })
            );
            return of(FormActions.formError(error));
          })
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private chainProxy: ChainProxy,
    private store: Store<StateModel>
  ) {}
}
