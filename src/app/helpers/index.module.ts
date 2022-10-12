import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UtilsHelper } from '@helpers/utils';
import { CryptoHelper } from '@helpers/crypto';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [],
  providers: [
    UtilsHelper,
    CryptoHelper,
  ],
  exports: []
})

export class NgAmonHelpersModule {
}
