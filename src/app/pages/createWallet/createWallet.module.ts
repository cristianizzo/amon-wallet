import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CreateWalletRoutingModule } from '@pages/createWallet/createWallet.routing';
import { LanguageComponent } from '@pages/createWallet/language/language.component';
import { WelcomeComponent } from '@pages/createWallet/welcome/welcome.component';
import { PickPasswordComponent } from '@pages/createWallet/pickPassword/pickPassword.component';
import { RecoveryPhraseComponent } from '@pages/createWallet/recoveryPhrase/recoveryPhrase.component';
import { BackButtonModule } from '@components/back-button/back-button.component.module';
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
  declarations: [
    LanguageComponent,
    WelcomeComponent,
    PickPasswordComponent,
    RecoveryPhraseComponent,
  ],
  providers: []
})
export class CreateWalletModule {
}
