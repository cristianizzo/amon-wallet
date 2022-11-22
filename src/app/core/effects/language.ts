import { Injectable } from '@angular/core';
import {
  Actions,
  createEffect,
  ofType,
  ROOT_EFFECTS_INIT,
} from '@ngrx/effects';
import { FormActions, LanguageActions } from '@app/core/actions';
import { of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import logger from '@app/app.logger';
import { LanguageProxy } from '@services/proxy/languages.proxy';
import { Store } from '@ngrx/store';
import { StateModel } from '@app/models';

const logContent = logger.logContent('core:effects:language');

@Injectable()
export class LanguageEffects {
  initLanguage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ROOT_EFFECTS_INIT),
      switchMap((_) => this.languageProxy.initLanguage()),
      map((language) => LanguageActions.updateStateLanguage(language)),
      catchError((error) => {
        logger.error(
          logContent.add({
            info: `error init language`,
            error,
          })
        );
        return of(FormActions.formError(error));
      })
    )
  );

  switchLanguage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LanguageActions.switchLanguage),
      tap(() =>
        this.store.dispatch(FormActions.formStart({ topLoading: true }))
      ),
      switchMap((action) => this.languageProxy.switchLanguage(action.language)),
      map((language) => LanguageActions.updateStateLanguage(language)),
      tap(() => this.store.dispatch(FormActions.formEnd())),
      catchError((error) => {
        logger.error(
          logContent.add({
            info: `error switch language`,
            error,
          })
        );
        return of(FormActions.formError(error));
      })
    )
  );

  constructor(
    private actions$: Actions,
    private languageProxy: LanguageProxy,
    private store: Store<StateModel>
  ) {}
}
