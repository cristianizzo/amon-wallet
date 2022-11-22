import { environment } from '@env/environment';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { metaReducers, reducers } from '@app/core/reducers';
import { EffectsModule } from '@ngrx/effects';
import { effects } from '@app/core/effects';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forRoot(reducers, {
      metaReducers,
      // runtimeChecks: {
      //   strictStateImmutability: true,
      //   strictActionImmutability: true,
      // },
    }),
    EffectsModule.forRoot(effects),
    !environment.production
      ? StoreDevtoolsModule.instrument({
          maxAge: 25,
        })
      : [],
  ],
  declarations: [],
  exports: [],
})
export class NgAmonCoreModule {
  public static forRoot(): ModuleWithProviders<NgAmonCoreModule> {
    return {
      ngModule: NgAmonCoreModule,
      providers: [],
    };
  }
}
