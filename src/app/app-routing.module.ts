import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('@pages/start/start.module').then((m) => m.StartModule),
  },
  {
    path: '',
    loadChildren: () =>
      import('@pages/create-wallet/createWallet.module').then(
        (m) => m.CreateWalletModule
      ),
  },
  {
    path: 'import-wallet',
    loadChildren: () =>
      import('@pages/import-wallet/importWallet.module').then(
        (m) => m.ImportWalletModule
      ),
  },
  {
    path: '',
    loadChildren: () =>
      import('@pages/tabs/tabs.module').then((m) => m.TabsPageModule),
  },
  {
    path: '**',
    redirectTo: '/',
  },
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
