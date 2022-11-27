import { Injectable } from '@angular/core';
import {
  Actions,
  createEffect,
  ofType,
  ROOT_EFFECTS_INIT,
} from '@ngrx/effects';
import { CurrencyActions, FormActions } from '@app/core/actions';
import { CurrencyProxy } from '@services/proxy/currency.proxy';
import { of } from 'rxjs';
import {
  catchError,
  map,
  switchMap,
  tap,
  withLatestFrom,
} from 'rxjs/operators';
import logger from '@app/app.logger';
import { Store } from '@ngrx/store';
import { StateModel } from '@app/models';
import { CurrencySelector } from '@core/selectors';

const logContent = logger.logContent('core:effects:currency');

@Injectable()
export class CurrencyEffects {
  initCurrency$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ROOT_EFFECTS_INIT),
      switchMap((_) => this.currencyProxy.initCurrency()),
      map((currency) => CurrencyActions.updateStateCurrency(currency)),
      catchError((error) => {
        logger.error(
          logContent.add({
            info: `error init currency`,
            error,
          })
        );
        return of(FormActions.formError(error));
      })
    )
  );

  getAllCurrencies$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CurrencyActions.getAllCurrencies),
      withLatestFrom(this.store.select(CurrencySelector.getCurrency)),
      switchMap(([_, currency]) =>
        this.currencyProxy.getAllCurrencies(currency)
      ),
      map((currencies) => CurrencyActions.getAllCurrenciesSuccess(currencies)),
      catchError((error) => {
        logger.error(
          logContent.add({
            info: `error get all currencies`,
            error,
          })
        );
        return of(FormActions.formError(error));
      })
    )
  );

  switchCurrency$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CurrencyActions.switchCurrency),
      tap(() =>
        this.store.dispatch(FormActions.formStart({ topLoading: true }))
      ),
      switchMap((action) => this.currencyProxy.switchCurrency(action.currency)),
      map((currency) => CurrencyActions.updateStateCurrency(currency)),
      tap(() => this.store.dispatch(FormActions.formEnd())),
      catchError((error) => {
        logger.error(
          logContent.add({
            info: `error switch currency`,
            error,
          })
        );
        return of(FormActions.formError(error));
      })
    )
  );

  constructor(
    private actions$: Actions,
    private currencyProxy: CurrencyProxy,
    private store: Store<StateModel>
  ) {}
}
