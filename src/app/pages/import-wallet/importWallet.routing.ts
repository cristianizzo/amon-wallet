import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@app/app.auth.guard';
import { RecoveryPhraseComponent } from '@pages/import-wallet/recovery-phrase/recovery-phrase.component';
import {PrivateKeyComponent} from '@pages/import-wallet/private-key/privateKey.component';

const routes: Routes = [
  {
    path: 'recovery-phrase',
    component: RecoveryPhraseComponent,
    canActivate: [AuthGuard],
  },
  {
    path: '',
    redirectTo: '/import-wallet/recovery-phrase',
    pathMatch: 'full',
  },

  {
    path: 'private-key',
    component: PrivateKeyComponent,
    canActivate: [AuthGuard],
  },
  {
    path: '',
    redirectTo: '/import-wallet/private-key',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ImportWalletRoutingModule {}
