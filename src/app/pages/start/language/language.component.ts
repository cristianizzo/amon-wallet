import { Component } from '@angular/core';
import { LanguageModel } from '@app/models';
import { NavController } from '@ionic/angular';
import { switchLanguage } from '@app/core/actions/language';
import { Store } from '@ngrx/store';
import { StateModel } from '@models/state.model';
import * as LanguageSelector from '@app/core/selectors/language';
import { ThemeSelector } from '@app/core/selectors';

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
    private navController: NavController
  ) {
    this.store.select(ThemeSelector.getTheme)
      .subscribe((theme) => this.selectedTheme = theme);
  }

  ionViewWillEnter(): void {
    this.store.select(LanguageSelector.getLanguages)
      .subscribe(languages => this.languages = languages);

    this.store.select(LanguageSelector.getLanguage)
      .subscribe(language => this.selectedLanguage = language);
  }

  onSelectedLanguage(language: LanguageModel): void {
    this.store.dispatch(switchLanguage(language));
    this.selectedLanguage = language;
  }

  async go() {
    if (this.selectedLanguage) {
      this.navController.navigateRoot('/welcome');
    }
  }
}
