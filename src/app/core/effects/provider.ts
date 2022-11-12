import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ProviderActions } from '@app/core/actions';
import { ProviderService } from '@services/providers.service';
import { ToastService } from '@services/toast.service';
import { ErrorService } from '@services/error.service';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

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
        console.log('providerError', error);
        return of(ProviderActions.providerError(error));
      })
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

  // switchProvider$ = createEffect(() =>
  //   this.actions$.pipe(
  //     ofType(ProviderActions.switchProvider),
  //     switchMap(async (action) => {
  //
  //       const dbProviders: ProviderModel[] = await this.localForageService.getItem('providers');
  //       this.web3Services.connectProvider(dbProviders.find(p => p.id === action.provider.id));
  //       return ProviderActions.getProvider();
  //     }))
  // );

  constructor(
    private actions$: Actions,
    private providerService: ProviderService,
    private toastService: ToastService,
    private errorService: ErrorService
  ) {}
}
