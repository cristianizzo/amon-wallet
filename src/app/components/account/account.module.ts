import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { AccountMenuComponent } from '@components/account/account-menu/account-menu.component';
import { AccountComponent } from '@components/account/component/account.component';
import { WalletMenuComponent } from '@components/account/wallet-menu/wallet-menu.component';
import { TranslateModule } from '@ngx-translate/core';
import { BackButtonModule } from '@components/back-button/back-button.module';
import { FormsModule } from '@angular/forms';
import { NgAmonPipesModule } from '@pipes/index.module';
import { NgAmonDirectivesModule } from '@directives/index.module';
import { ExportWalletModule } from '@components/export-wallet/export-wallet.module';
import { LoaderModule } from '@components/loader/loader.component.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    TranslateModule,
    BackButtonModule,
    FormsModule,
    NgAmonPipesModule,
    NgAmonDirectivesModule,
    ExportWalletModule,
    LoaderModule,
  ],
  exports: [AccountComponent, AccountMenuComponent, WalletMenuComponent],
  entryComponents: [],
  declarations: [AccountComponent, AccountMenuComponent, WalletMenuComponent],
})
export class AccountModule {}
