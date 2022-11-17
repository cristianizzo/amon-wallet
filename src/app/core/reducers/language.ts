import { LanguageModel } from '@app/models';
import { Action, createReducer, on } from '@ngrx/store';
import { LanguageActions } from '@app/core/actions';

export const featureKey = 'languages';
const initialState: LanguageModel[] = [];

export const languageReducer = createReducer(
  initialState,
  on(
    LanguageActions.updateStateLanguages,
    (_: LanguageModel[] = initialState, { languages }) => languages
  ),
  on(
    LanguageActions.switchLanguage,
    (state: LanguageModel[] = initialState, { language }) =>
      state.map((p) =>
        Object.assign({}, p, {
          selected: p.lang === language.lang,
        })
      )
  )
);

export const reducer = (
  state: LanguageModel[] | undefined,
  action: Action
): any => languageReducer(state, action);
