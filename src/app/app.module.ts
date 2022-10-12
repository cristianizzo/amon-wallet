import { environment } from '@env/environment';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppRoutingModule } from './app-routing.module';
import { AuthGuard } from '@app/app.auth.guard';
import { AmonComponent } from './app.component';
import { AppConfig } from './app.config';
import { NgAmonServicesModule } from '@app/services/index.module';
import { NgAmonHelpersModule } from '@helpers/index.module';
import { NgAmonPipesModule } from '@pipes/index.module';
import { NgAmonDirectivesModule } from '@directives/index.module';
import { DEFAULT_CONFIG, Driver, NgForageOptions } from 'ngforage';

@NgModule({
  declarations: [
    AmonComponent
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    NgAmonServicesModule.forRoot(environment),
    NgAmonHelpersModule,
    NgAmonPipesModule,
    NgAmonDirectivesModule,
  ],
  providers: [
    AppConfig,
    AuthGuard,
    {provide: RouteReuseStrategy, useClass: IonicRouteStrategy},
    {
      provide: DEFAULT_CONFIG,
      useValue: {
        name: 'amon',
        driver: [ // defaults to indexedDB -> webSQL -> localStorage
          Driver.INDEXED_DB,
          Driver.LOCAL_STORAGE
        ]
      } as NgForageOptions
    }
  ],
  bootstrap: [AmonComponent],
})
export class AppModule {
}
