import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ImportWalletRoutingModule } from '@pages/import-wallet/import-wallet.routing';
import { RecoveryPhraseComponent } from '@pages/import-wallet/recovery-phrase/recovery-phrase.component';
import { PrivateKeyComponent } from '@pages/import-wallet/private-key/privateKey.component';

import { BackButtonModule } from '@components/back-button/back-button.module';
import { NgAmonPipesModule } from '@pipes/index.module';
import { NgAmonDirectivesModule } from '@directives/index.module';
import { KeystoreFileComponent } from '@pages/import-wallet/keystore-file/keystoreFile.component';

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
  declarations: [
    RecoveryPhraseComponent,
    PrivateKeyComponent,
    KeystoreFileComponent,
  ],
  providers: [],
})
export class ImportWalletModule {}
