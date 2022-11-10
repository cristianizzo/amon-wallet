import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { WalletActionButtonsComponent } from '@components/wallet-action-buttons/walletActionButtons.component';
import { TranslateModule } from '@ngx-translate/core';
import { BackButtonModule } from '@components/back-button/back-button.module';
import { FormsModule } from '@angular/forms';
import { NgAmonPipesModule } from '@pipes/index.module';
import { NgAmonDirectivesModule } from '@directives/index.module';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    TranslateModule,
    BackButtonModule,
    FormsModule,
    NgAmonPipesModule,
    NgAmonDirectivesModule,
    RouterModule,
  ],
  exports: [WalletActionButtonsComponent],
  entryComponents: [],
  declarations: [WalletActionButtonsComponent],
})
export class WalletActionButtonsModule {}
