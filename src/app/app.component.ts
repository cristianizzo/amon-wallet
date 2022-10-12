import { Component } from '@angular/core';
import { LanguageService } from '@services/languages.service';
import { Platform } from '@ionic/angular';
import { ThemeService } from '@services/theme.service';
import { AppConfig } from './app.config';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AmonComponent {
  constructor(
    private platform: Platform,
    private themeService: ThemeService,
    private languageService: LanguageService,
    private appConfig: AppConfig,
  ) {
    this.appConfig.loadConfiguration();
    this.initializeApp();
  }

  private initializeApp() {

    this.platform.ready().then(async () => {

      this.languageService.init();
      this.themeService.init();

      // logger.info(logContent(Object.assign({}, {
      //   info: `app running on ${environment.host} - env: ${environment.env}`
      // })));
    });
  }
}
