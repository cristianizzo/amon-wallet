import { Component } from '@angular/core';
import { LanguageModel } from '@app/models';
import { LanguageService } from '@app/services/languages.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-language',
  templateUrl: 'language.index.html',
  styleUrls: ['language.style.scss'],
})
export class LanguageComponent {

  public languages: LanguageModel[];
  public selectedLanguage: LanguageModel | undefined;

  constructor(
    private languageService: LanguageService,
    private navController: NavController
  ) {
  }

  ionViewWillEnter(): void {
    this.languages = this.languageService.getLanguages();
  }

  onSelectedLanguage(language: LanguageModel): void {
    const foundIndex = this.languages.findIndex(x => x.lang === language.lang);
    this.languages[foundIndex].selected = true;
    this.selectedLanguage = language;
  }

  async go() {
    if (this.selectedLanguage) {
      this.languageService.setLanguage(this.selectedLanguage.lang);
      this.navController.navigateRoot('/welcome');
    }
  }
}
