import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { FormActions, ThemeActions } from '@app/core/actions';
import { ThemeService } from '@services/theme.service';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import logger from '@app/app.logger';

const logContent = logger.logContent('core:effects:theme');

@Injectable()
export class ThemeEffects {
  initLanguage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ThemeActions.initTheme),
      switchMap((_) => this.themeService.init()),
      map((theme) => ThemeActions.updateStateTheme(theme)),
      catchError((error) => {
        logger.error(
          logContent.add({
            info: `error init theme`,
            error,
          })
        );
        return of(FormActions.formError(error));
      })
    )
  );

  switchTheme$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ThemeActions.switchTheme),
        switchMap(async (action) => this.themeService.saveTheme(action.theme)),
        catchError((error) => {
          logger.error(
            logContent.add({
              info: `error switch theme`,
              error,
            })
          );
          return of(FormActions.formError(error));
        })
      ),
    { dispatch: false }
  );

  constructor(private actions$: Actions, private themeService: ThemeService) {}
}
