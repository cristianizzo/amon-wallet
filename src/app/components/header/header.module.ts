import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { AccountMenuComponent } from '@components/header/account-menu/account-menu.component';
import { AccountComponent } from '@components/header/account/account.component';
import { WalletMenuComponent } from '@components/header/wallet-menu/wallet-menu.component';
import { HeaderComponent } from '@components/header/component/header.component';
import { TranslateModule } from '@ngx-translate/core';
import { BackButtonModule } from '@components/back-button/back-button.module';
import { FormsModule } from '@angular/forms';
import { NgAmonPipesModule } from '@pipes/index.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    TranslateModule,
    BackButtonModule,
    FormsModule,
    NgAmonPipesModule,
  ],
  exports: [
    HeaderComponent,
    AccountComponent,
    AccountMenuComponent,
    WalletMenuComponent,
  ],
  entryComponents: [],
  declarations: [
    HeaderComponent,
    AccountComponent,
    AccountMenuComponent,
    WalletMenuComponent,
  ],
})
export class HeaderModule {}
