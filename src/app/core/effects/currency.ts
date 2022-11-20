import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { CurrencyActions, FormActions } from '@app/core/actions';
import { CurrencyProxy } from '@services/proxy/currency.proxy';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import logger from '@app/app.logger';

const logContent = logger.logContent('core:effects:currency');

@Injectable()
export class CurrencyEffects {
  initCurrency$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CurrencyActions.initCurrency),
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

  switchCurrency$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CurrencyActions.switchCurrency),
      switchMap((action) =>
        this.currencyProxy.switchCurrency(action.currency)
      ),
      map((currency) => CurrencyActions.updateStateCurrency(currency)),
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
  ) {}
}
