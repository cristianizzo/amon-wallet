import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UtilsHelper } from '@helpers/utils';
import { CryptoHelper } from '@helpers/crypto';
import { FormValidationHelper } from '@helpers/validation-form';
import { HDPathsHelper } from '@helpers/hdPaths';
import { WalletHelper } from '@helpers/wallet';

@NgModule({
  imports: [CommonModule],
  declarations: [FormValidationHelper],
  providers: [
    FormValidationHelper,
    UtilsHelper,
    WalletHelper,
    CryptoHelper,
    HDPathsHelper,
  ],
  exports: [FormValidationHelper],
})
export class NgAmonHelpersModule {}
