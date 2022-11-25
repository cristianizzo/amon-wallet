import { Injectable } from '@angular/core';
import {
  Actions,
  createEffect,
  ofType,
  ROOT_EFFECTS_INIT,
} from '@ngrx/effects';
import { ChainActions, FormActions, TokenActions } from '@app/core/actions';
import { ChainProxy } from '@services/proxy/chain.proxy';
import { of } from 'rxjs';
import {
  catchError,
  concatMap,
  map,
  mergeMap,
  switchMap,
  tap,
  withLatestFrom,
} from 'rxjs/operators';
import logger from '@app/app.logger';
import { ChainSelector } from '@core/selectors';
import { Store } from '@ngrx/store';
import { StateModel } from '@app/models';

const logContent = logger.logContent('core:effects:chain');

@Injectable()
export class ChainEffects {
  initChain$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ROOT_EFFECTS_INIT),
      tap(() =>
        this.store.dispatch(FormActions.formStart({ topLoading: true }))
      ),
      switchMap((_) => this.chainProxy.initChain()),
      map((chain) => ChainActions.updateStateChain(chain)),
      tap(() => this.store.dispatch(FormActions.formEnd())),
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

  getAllChains$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ChainActions.getAllChains),
      tap(() => [
        this.store.dispatch(FormActions.formStart({ topLoading: true })),
      ]),
      withLatestFrom(this.store.select(ChainSelector.getChain)),
      switchMap(([_, chain]) => this.chainProxy.getAllChains(chain)),
      map((chains) => ChainActions.getAllChainsSuccess(chains)),
      tap(() => [
        this.store.dispatch(FormActions.formEnd()),
      ]),
      catchError((error) => {
        logger.error(
          logContent.add({
            info: `error get all chains`,
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
      tap(() =>
        this.store.dispatch(
          FormActions.formStart({ topLoading: true, loading: true })
        )
      ),
      concatMap((action) =>
        this.chainProxy.addCustomChain(action.chain).pipe(
          mergeMap((chain) => [
            TokenActions.resetState(),
            ChainActions.updateStateChain(chain),
            TokenActions.initTokens(),
          ]),
          tap(() => this.store.dispatch(FormActions.formEnd())),
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
      tap(() =>
        this.store.dispatch(
          FormActions.formStart({ topLoading: true, loading: true })
        )
      ),
      concatMap((action) =>
        this.chainProxy.switchChain(action.chain).pipe(
          mergeMap((chain) => [
            TokenActions.resetState(),
            ChainActions.updateStateChain(chain),
            TokenActions.initTokens(),
          ]),
          tap(() => this.store.dispatch(FormActions.formEnd())),
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
