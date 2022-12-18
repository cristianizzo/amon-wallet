import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@app/app.auth.guard';
import { RecoveryPhraseComponent } from '@pages/import-wallet/recovery-phrase/recovery-phrase.component';
import { PrivateKeyComponent } from '@pages/import-wallet/private-key/privateKey.component';
import { KeystoreFileComponent } from '@pages/import-wallet/keystore-file/keystoreFile.component';
import { DerivatePathsComponent } from '@pages/import-wallet/derivate-paths/derivate-paths.component';

const routes: Routes = [
  {
    path: 'recovery-phrase',
    component: RecoveryPhraseComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'private-key',
    component: PrivateKeyComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'keystore-file',
    component: KeystoreFileComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'derivate-paths',
    component: DerivatePathsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: '',
    redirectTo: '/import-wallet/recovery-phrase',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ImportWalletRoutingModule {}
