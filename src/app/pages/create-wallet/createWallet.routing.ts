import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@app/app.auth.guard';
import { PickPasswordComponent } from '@pages/create-wallet/pick-password/pickPassword.component';
import { SeedPhraseComponent } from '@pages/create-wallet/seed-phrase/seedPhrase.component';

const routes: Routes = [
  {
    path: 'pick-password',
    component: PickPasswordComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'seed-phrase',
    component: SeedPhraseComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CreateWalletRoutingModule {
}
