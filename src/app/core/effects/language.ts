import { Injectable } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { FormActions, LanguageActions } from '@app/core/actions';
import { LanguageService } from '@services/languages.service';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import logger from '@app/app.logger';
import { LanguageSelector } from '@core/selectors';
import { Store } from '@ngrx/store';
import { StateModel } from '@app/models';

const logContent = logger.logContent('core:effects:language');

@Injectable()
export class LanguageEffects {
  initLanguage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LanguageActions.initLanguage),
      switchMap((_) => this.languageService.initLanguages()),
      map((languages) => LanguageActions.updateStateLanguages(languages)),
      catchError((error) => {
        logger.error(
          logContent.add({
            info: `error init languages`,
            error,
          })
        );
        return of(FormActions.formError(error));
      })
    )
  );

  switchLanguage$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(LanguageActions.switchLanguage),
        concatLatestFrom(() => [
          this.store.select(LanguageSelector.getLanguages),
        ]),
        switchMap(([action, languages]) =>
          this.languageService.switchLanguage(action.language, languages)
        ),
        map((languages) => LanguageActions.updateStateLanguages(languages)),
        catchError((error) => {
          logger.error(
            logContent.add({
              info: `error switch languages`,
              error,
            })
          );
          return of(FormActions.formError(error));
        })
      ),
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private languageService: LanguageService,
    private store: Store<StateModel>
  ) {}
}
