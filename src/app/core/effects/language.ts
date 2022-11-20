import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { FormActions, LanguageActions } from '@app/core/actions';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import logger from '@app/app.logger';
import { LanguageProxy } from '@services/proxy/languages.proxy';

const logContent = logger.logContent('core:effects:language');

@Injectable()
export class LanguageEffects {
  initLanguage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LanguageActions.initLanguage),
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
      switchMap((action) => this.languageProxy.switchLanguage(action.language)),
      map((language) => LanguageActions.updateStateLanguage(language)),
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
    private languageProxy: LanguageProxy
  ) {}
}
