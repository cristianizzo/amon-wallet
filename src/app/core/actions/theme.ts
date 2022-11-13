import { createAction } from '@ngrx/store';
import { type } from '@app/core/util';

export const languageActionTypes = {
  initTheme: type('[Theme] init theme'),
  updateStateTheme: type('[Theme] update state theme'),
  switchTheme: type('[Theme] switch theme'),
  getTheme: type('[Theme] get theme'),
  themeError: type('[Theme] theme error'),
};

export const initTheme = createAction(languageActionTypes.initTheme);

export const updateStateTheme = createAction(
  languageActionTypes.updateStateTheme,
  (theme: string) => ({ theme })
);

export const switchTheme = createAction(
  languageActionTypes.switchTheme,
  (theme: string) => ({ theme })
);

export const themeError = createAction(
  languageActionTypes.themeError,
  (error: any) => ({ error })
);
