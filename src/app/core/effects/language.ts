import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, switchMap } from 'rxjs/operators';
import { LanguageActions } from '@app/core/actions';
import { LanguageService } from '@services/languages.service';
import { ToastService } from '@services/toast.service';
import { ErrorService } from '@services/error.service';

@Injectable()
export class LanguageEffects {
  initLanguage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LanguageActions.initLanguage),
      switchMap((_) =>
        this.languageService
          .initLanguages()
          .pipe(
            map((languages) => LanguageActions.updateStateLanguages(languages))
          )
      )
    )
  );

  error$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(LanguageActions.languageError),
        map(({ error }) => {
          this.toastService.responseError(this.errorService.parseError(error));
        })
      ),
    { dispatch: false }
  );

  switchLanguage$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(LanguageActions.switchLanguage),
        switchMap(async (action) =>
          this.languageService.setLanguage(action.language.lang)
        )
      ),
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private languageService: LanguageService,
    private toastService: ToastService,
    private errorService: ErrorService
  ) {}
}
