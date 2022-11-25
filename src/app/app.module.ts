import { environment } from '@env/environment';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppRoutingModule } from '@app/app-routing.module';
import { AuthGuard } from '@app/app.auth.guard';
import { AmonComponent } from '@app/app.component';
import { AppConfig } from '@app/app.config';
import { NgAmonServicesModule } from '@app/services/index.module';
import { NgAmonHelpersModule } from '@helpers/index.module';
import { NgAmonPipesModule } from '@pipes/index.module';
import { NgAmonDirectivesModule } from '@directives/index.module';
import { NgAmonCoreModule } from '@core/index.module';
import { NgAmonModuleModule } from '@app/modules/index.module';
import { DEFAULT_CONFIG, Driver, NgForageOptions } from 'ngforage';
import { LoadingBarModule } from '@components/loading-bar/loading-bar.module';

@NgModule({
  declarations: [AmonComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    NgAmonServicesModule.forRoot(environment),
    NgAmonModuleModule.forRoot(),
    NgAmonHelpersModule,
    NgAmonPipesModule,
    NgAmonDirectivesModule,
    NgAmonCoreModule.forRoot(),
    LoadingBarModule,
  ],
  providers: [
    AppConfig,
    AuthGuard,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    {
      provide: DEFAULT_CONFIG,
      useValue: {
        name: 'amon',
        driver: [
          // defaults to indexedDB -> webSQL -> localStorage
          Driver.INDEXED_DB,
          Driver.LOCAL_STORAGE,
        ],
      } as NgForageOptions,
    },
  ],
  bootstrap: [AmonComponent],
})
export class AppModule {}
