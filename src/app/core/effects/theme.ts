import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, switchMap } from 'rxjs/operators';
import { ThemeActions } from '@app/core/actions';
import { ThemeService } from '@services/theme.service';

@Injectable()
export class ThemeEffects {
  initLanguage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ThemeActions.initTheme),
      switchMap((_) =>
        this.themeService
          .init()
          .pipe(map((theme) => ThemeActions.updateStateTheme(theme)))
      )
    )
  );

  switchLanguage$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ThemeActions.switchTheme),
        switchMap(async (action) => this.themeService.saveTheme(action.theme))
      ),
    { dispatch: false }
  );

  constructor(private actions$: Actions, private themeService: ThemeService) {}
}
