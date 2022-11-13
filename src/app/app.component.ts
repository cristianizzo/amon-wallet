import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { AppConfig } from './app.config';
import { environment } from '@env/environment';
import logger from '@app/app.logger';

const logContent = logger.logContent('app:root');

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AmonComponent {
  constructor(private platform: Platform, private appConfig: AppConfig) {
    this.initializeApp();
  }

  private initializeApp() {
    this.platform.ready().then(async () => {
      this.appConfig.loadConfiguration();

      logger.info(
        logContent.add({
          info: `app running on ${environment.host} - env: ${environment.env}`,
        })
      );
    });
  }
}
