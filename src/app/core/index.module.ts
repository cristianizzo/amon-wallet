import { environment } from '@env/environment';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { metaReducers, reducers } from '@app/core/reducers';
import { EffectsModule } from '@ngrx/effects';
import { effects } from '@app/core/effects';

const instrument = [];
if (!environment.production) {
  instrument.push(
    StoreDevtoolsModule.instrument({
      maxAge: 25,
    })
  );
}

@NgModule({
  imports: [
    StoreModule.forRoot(reducers, {
      metaReducers,
      // runtimeChecks: {
      //   strictStateImmutability: true,
      //   strictActionImmutability: true,
      // },
    }),
    EffectsModule.forRoot(effects),
    instrument,
  ],
  declarations: [],
  exports: [StoreModule, EffectsModule],
})
export class NgAmonCoreModule {
  public static forRoot(): ModuleWithProviders<NgAmonCoreModule> {
    return {
      ngModule: NgAmonCoreModule,
      providers: [],
    };
  }
}
