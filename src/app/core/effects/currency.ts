import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { CurrencyActions } from '@app/core/actions';
import { CurrencyService } from '@services/currency.service';
import { ToastService } from '@services/toast.service';
import { ErrorService } from '@services/error.service';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

@Injectable()
export class CurrencyEffects {
  initCurrencies$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CurrencyActions.initCurrencies),
      switchMap((_) =>
        this.currencyService
          .initCurrencies()
          .pipe(
            map((currencies) =>
              CurrencyActions.updateStateCurrencies(currencies)
            )
          )
      ),
      catchError((error) => of(CurrencyActions.currencyError(error)))
    )
  );

  error$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(CurrencyActions.currencyError),
        map(({ error }) => {
          this.toastService.responseError(this.errorService.parseError(error));
        })
      ),
    { dispatch: false }
  );

  // switchProvider$ = createEffect(() =>
  //   this.actions$.pipe(
  //     ofType(CurrencyActions.switchProvider),
  //     switchMap(async (action) => {
  //
  //       const dbProviders: ProviderModel[] = await this.localForageService.getItem('providers');
  //       this.web3Services.connectProvider(dbProviders.find(p => p.id === action.provider.id));
  //       return CurrencyActions.getProvider();
  //     }))
  // );

  constructor(
    private actions$: Actions,
    private currencyService: CurrencyService,
    private toastService: ToastService,
    private errorService: ErrorService
  ) {}
}
