import { Component } from '@angular/core';
import { LanguageModel } from '@app/models';
import { NavController } from '@ionic/angular';
import { LanguageActions } from '@app/core/actions';
import { Store } from '@ngrx/store';
import { StateModel } from '@models/state.model';
import * as LanguageSelector from '@app/core/selectors/language';
import { ThemeSelector } from '@app/core/selectors';
import { LanguageProxy } from '@services/proxy/languages.proxy';

@Component({
  selector: 'app-language',
  templateUrl: 'language.component.html',
  styleUrls: ['language.component.scss'],
})
export class LanguageComponent {
  public selectedTheme: string;
  public languages: LanguageModel[];
  public selectedLanguage: LanguageModel | undefined;

  constructor(
    private readonly store: Store<StateModel>,
    private navController: NavController,
    private languageProxy: LanguageProxy
  ) {
    this.store
      .select(ThemeSelector.getTheme)
      .subscribe((theme) => (this.selectedTheme = theme));
  }

  ionViewWillEnter(): void {
    this.languages = this.languageProxy.getAllLanguages();

    this.store
      .select(LanguageSelector.getLanguage)
      .subscribe((language) => (this.selectedLanguage = language));
  }

  switchLanguage(language: LanguageModel): void {
    this.store.dispatch(LanguageActions.switchLanguage(language));
    this.selectedLanguage = language;
  }

  async go() {
    if (this.selectedLanguage) {
      this.navController.navigateRoot('/welcome');
    }
  }
}
