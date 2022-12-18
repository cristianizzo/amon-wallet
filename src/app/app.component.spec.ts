import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TestBed, waitForAsync } from '@angular/core/testing';

import { AmonComponent } from './app.component';
import { AppConfig } from '@app/app.config';
import { NgAmonServicesModule } from '@services/index.module';
import { environment } from '@env/environment';
import { BrowserModule } from '@angular/platform-browser';
import { IonicModule } from '@ionic/angular';
import { AppRoutingModule } from '@app/app-routing.module';
import { NgAmonHelpersModule } from '@helpers/index.module';
import { NgAmonPipesModule } from '@pipes/index.module';
import { NgAmonDirectivesModule } from '@directives/index.module';
import { NgAmonCoreModule } from '@core/index.module';
import { LoadingBarModule } from '@components/loading-bar/loading-bar.module';

describe('AmonComponent', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserModule,
        IonicModule.forRoot(),
        AppRoutingModule,
        NgAmonServicesModule.forRoot(environment),
        NgAmonHelpersModule,
        NgAmonPipesModule,
        NgAmonDirectivesModule,
        NgAmonCoreModule.forRoot(),
        LoadingBarModule,
      ],
      declarations: [AmonComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [AppConfig],
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AmonComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });
});
