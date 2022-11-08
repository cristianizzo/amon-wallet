import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsComponent } from '@pages/tabs/component/tabs.component';
import { AuthGuard } from '@app/app.auth.guard';

const routes: Routes = [
  {
    path: 'auth',
    component: TabsComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'assets',
        loadChildren: () =>
          import('@pages/assets/assets.module').then((m) => m.AssetsModule),
      },
      {
        path: 'deposit',
        loadChildren: () =>
          import('@pages/deposit/deposit.module').then((m) => m.DepositModule),
      },
      {
        path: 'exchange',
        loadChildren: () =>
          import('@pages/exchange/exchange.module').then(
            (m) => m.ExchangeModule
          ),
      },
      {
        path: 'nfts',
        loadChildren: () =>
          import('@pages/nfts/nfts.module').then((m) => m.NftsPageModule),
      },
      {
        path: 'setting',
        loadChildren: () =>
          import('@pages/setting/setting.module').then((m) => m.SettingModule),
      },
      {
        path: '',
        redirectTo: '/auth/assets',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/auth/assets',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule {}
