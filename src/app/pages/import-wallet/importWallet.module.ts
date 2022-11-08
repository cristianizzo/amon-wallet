import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ImportWalletRoutingModule } from '@pages/import-wallet/importWallet.routing';
import { RecoveryPhraseComponent } from '@pages/import-wallet/recovery-phrase/recovery-phrase.component';
import { BackButtonModule } from '@components/back-button/back-button.module';
import { NgAmonPipesModule } from '@pipes/index.module';
import { NgAmonDirectivesModule } from '@directives/index.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ImportWalletRoutingModule,
    ReactiveFormsModule,
    TranslateModule.forChild(),
    BackButtonModule,
    NgAmonPipesModule,
    NgAmonDirectivesModule,
  ],
  declarations: [RecoveryPhraseComponent],
  providers: [],
})
export class ImportWalletModule {}
