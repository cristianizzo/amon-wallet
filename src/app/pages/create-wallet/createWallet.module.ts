import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CreateWalletRoutingModule } from '@pages/create-wallet/createWallet.routing';
import { PickPasswordComponent } from '@pages/create-wallet/pick-password/pickPassword.component';
import { SeedPhraseComponent } from '@pages/create-wallet/seed-phrase/seedPhrase.component';
import { BackButtonModule } from '@components/back-button/back-button.module';
import { MatPasswordStrengthModule } from '@angular-material-extensions/password-strength';
import { NgAmonPipesModule } from '@pipes/index.module';
import { NgAmonDirectivesModule } from '@directives/index.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    CreateWalletRoutingModule,
    ReactiveFormsModule,
    TranslateModule.forChild(),
    BackButtonModule,
    MatPasswordStrengthModule.forRoot(),
    NgAmonPipesModule,
    NgAmonDirectivesModule,
  ],
  declarations: [PickPasswordComponent, SeedPhraseComponent],
  providers: [],
})
export class CreateWalletModule {}
