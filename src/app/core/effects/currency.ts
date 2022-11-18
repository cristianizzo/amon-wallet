import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { CurrencyActions, FormActions } from '@app/core/actions';
import { CurrencyService } from '@services/currency.service';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import logger from '@app/app.logger';

const logContent = logger.logContent('core:effects:currency');

@Injectable()
export class CurrencyEffects {
  initCurrencies$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CurrencyActions.initCurrencies),
      switchMap((_) => this.currencyService.initCurrencies()),
      map((currencies) => CurrencyActions.updateStateCurrencies(currencies)),
      catchError((error) => {
        logger.error(
          logContent.add({
            info: `error init currencies`,
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
        this.currencyService.switchCurrency(action.currency)
      ),
      map((currencies) => CurrencyActions.updateStateCurrencies(currencies)),
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
    private currencyService: CurrencyService
  ) {}
}
