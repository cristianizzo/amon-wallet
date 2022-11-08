import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WalletModule } from '@app/modules/wallet.module';

export { WalletModule };

@NgModule({
  imports: [CommonModule],
  declarations: [],
  exports: [],
})
export class NgAmonModuleModule {
  public static forRoot(): ModuleWithProviders<NgAmonModuleModule> {
    return {
      ngModule: NgAmonModuleModule,
      providers: [WalletModule],
    };
  }
}
