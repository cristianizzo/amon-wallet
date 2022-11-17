import { Injectable } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { FormActions, NetworkActions, TokenActions } from '@app/core/actions';
import { NetworkService } from '@services/networks.service';
import { of } from 'rxjs';
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';
import logger from '@app/app.logger';
import { Store } from '@ngrx/store';
import { StateModel } from '@app/models';
import { CurrencySelector, WalletSelector } from '@core/selectors';

const logContent = logger.logContent('core:effects:network');

@Injectable()
export class NetworkEffects {
  initNetworks$ = createEffect(() =>
    this.actions$.pipe(
      ofType(NetworkActions.initNetworks),
      switchMap((_) => this.networkService.initNetworks()),
      map((networks) => NetworkActions.updateStateNetworks(networks)),
      catchError((error) => {
        logger.error(
          logContent.add({
            info: `error init networks`,
            error,
          })
        );
        return of(FormActions.formError(error));
      })
    )
  );

  switchNetwork$ = createEffect(() =>
    this.actions$.pipe(
      ofType(NetworkActions.switchNetwork),
      concatLatestFrom(() => [
        this.store.select(CurrencySelector.getCurrency),
        this.store.select(WalletSelector.getWallet),
      ]),
      switchMap(([action]) =>
        this.networkService.switchNetwork(action.network).pipe(
          mergeMap((networks) => [
            TokenActions.resetState(),
            NetworkActions.updateStateNetworks(networks),
            TokenActions.initTokens(),
          ]),
          catchError((error) => {
            logger.error(
              logContent.add({
                info: `error switch network`,
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
    private networkService: NetworkService,
    private store: Store<StateModel>
  ) {}
}
