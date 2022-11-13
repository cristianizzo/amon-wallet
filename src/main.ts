import '@app/helpers/logger/sentry.logger';
import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from '@app/app.module';
import { environment } from '@env/environment';
import logger from '@app/app.logger';

const logContent = logger.logContent('main');

if (environment.env === 'prod' || environment.env === 'dev') {
  enableProdMode();
}

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch((error) =>
    logger.error(
      logContent.add({
        info: 'Error startup',
        error,
      })
    )
  );
