import { Action, createReducer, on } from '@ngrx/store';
import { ThemeActions } from '@app/core/actions';
import { environment } from '@env/environment';

export const featureKey = 'theme';
const initialState: string = environment.theme;

export const themeReducer = createReducer(
  initialState,
  on(
    ThemeActions.updateStateTheme,
    (_: string = initialState, { theme }) => theme
  ),
  on(ThemeActions.switchTheme, (_: string = initialState, { theme }) => theme)
);

export const reducer = (state: string | undefined, action: Action): any =>
  themeReducer(state, action);
