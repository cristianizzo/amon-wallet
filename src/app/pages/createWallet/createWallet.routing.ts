import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@app/app.auth.guard';
import { LanguageComponent } from '@pages/createWallet/language/language.component';
import { WelcomeComponent } from '@pages/createWallet/welcome/welcome.component';
import { PickPasswordComponent } from '@pages/createWallet/pickPassword/pickPassword.component';
import { RecoveryPhraseComponent } from '@pages/createWallet/recoveryPhrase/recoveryPhrase.component';

const routes: Routes = [
  {
    path: '',
    component: LanguageComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'welcome',
    component: WelcomeComponent,
  },
  {
    path: 'pick-password',
    component: PickPasswordComponent,
  },
  {
    path: 'recovery-phrase',
    component: RecoveryPhraseComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CreateWalletRoutingModule {
}
