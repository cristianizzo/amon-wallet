import { LanguageModel } from '@app/models';
import { Action, createReducer, on } from '@ngrx/store';
import { LanguageActions } from '@app/core/actions';

export const featureKey = 'language';
const initialState: LanguageModel = null;

export const languageReducer = createReducer(
  initialState,
  on(
    LanguageActions.updateStateLanguage,
    (_: LanguageModel = initialState, { language }) => language
  )
);

export const reducer = (
  state: LanguageModel | undefined,
  action: Action
): any => languageReducer(state, action);
