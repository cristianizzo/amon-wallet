import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { AppConfig } from './app.config';

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

      // logger.info(logContent(Object.assign({}, {
      //   info: `app running on ${environment.host} - env: ${environment.env}`
      // })));
    });
  }
}
