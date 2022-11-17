import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { FormActions } from '@app/core/actions';
import { ToastService } from '@services/toast.service';
import { ErrorService } from '@services/error.service';
import { map, mergeMap } from 'rxjs/operators';
import logger from '@app/app.logger';
import { Store } from '@ngrx/store';
import { StateModel } from '@app/models';
import { UtilsHelper } from '@helpers/utils';
import { LoadingController } from '@ionic/angular';

const logContent = logger.logContent('core:effects:form');

@Injectable()
export class FormEffects {
  success$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FormActions.formSuccess),
      map(({ msg }) => {
        this.store.dispatch(FormActions.setLoading({ loading: false }));
        this.toastService.responseSuccess(msg);
      }),
      mergeMap(() => [])
    )
  );

  error$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(FormActions.formError),
        map(({ error }) => {
          this.store.dispatch(FormActions.setLoading({ loading: false }));
          this.toastService.responseError(this.errorService.parseError(error));
        }),
        mergeMap(() => [])
      ),
    { dispatch: false }
  );

  loader$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(FormActions.setLoading),
        map(({ status }) => {
          if (status.loading) {
            this.openLoader();
          } else {
            this.closeLoader();
          }
        }),
        mergeMap(() => [])
      ),
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private toastService: ToastService,
    private errorService: ErrorService,
    private utilsHelper: UtilsHelper,
    private loadingController: LoadingController,
    private readonly store: Store<StateModel>
  ) {}

  async openLoader() {
    let loader = await this.loadingController.getTop();
    if (!loader) {
      loader = await this.loadingController.create(
        this.utilsHelper.loaderOption()
      );
      await loader.present();
    }
  }

  async closeLoader() {
    const loader = await this.loadingController.getTop();
    if (loader) {
      await loader.dismiss();
    }
  }
}
