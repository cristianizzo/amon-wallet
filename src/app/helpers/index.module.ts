import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UtilsHelper } from '@helpers/utils';
import { CryptoHelper } from '@helpers/crypto';
import { FormValidationHelper } from '@helpers/validation-form';

@NgModule({
  imports: [CommonModule],
  declarations: [FormValidationHelper],
  providers: [FormValidationHelper, UtilsHelper, CryptoHelper],
  exports: [FormValidationHelper],
})
export class NgAmonHelpersModule {}
