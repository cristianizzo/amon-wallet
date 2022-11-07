import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@app/app.auth.guard';
import { RecoveryPhraseComponent } from '@pages/import-wallet/recovery-phrase/recovery-phrase.component';

const routes: Routes = [
  {
    path: 'recovery-phrase',
    component: RecoveryPhraseComponent,
    canActivate: [AuthGuard]
  },
  {
    path: '',
    redirectTo: '/import-wallet/recovery-phrase',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ImportWalletRoutingModule {
}
