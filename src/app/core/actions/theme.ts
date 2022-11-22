import { createAction } from '@ngrx/store';
import { type } from '@app/core/util';

export const languageActionTypes = {
  updateStateTheme: type('[Theme] update state theme'),
  switchTheme: type('[Theme] switch theme'),
  getTheme: type('[Theme] get theme'),
};

export const updateStateTheme = createAction(
  languageActionTypes.updateStateTheme,
  (theme: string) => ({ theme })
);

export const switchTheme = createAction(
  languageActionTypes.switchTheme,
  (theme: string) => ({ theme })
);
