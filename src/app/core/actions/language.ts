import { createAction } from '@ngrx/store';
import { LanguageModel } from '@models/language.model';
import { type } from '@app/core/util';

export const languageActionTypes = {
  switchLanguage: type('[Language] switch language'),
  getLanguage: type('[Language] get language'),
  updateStateLanguage: type('[Language] update state language'),
};

export const switchLanguage = createAction(
  languageActionTypes.switchLanguage,
  (language: LanguageModel) => ({ language })
);

export const updateStateLanguage = createAction(
  languageActionTypes.updateStateLanguage,
  (language: LanguageModel) => ({ language })
);
