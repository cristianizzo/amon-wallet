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
        path: 'withdraw',
        loadChildren: () =>
          import('@pages/withdraw/withdraw.module').then(
            (m) => m.WithdrawModule
          ),
      },
      {
        path: 'exchange',
        loadChildren: () =>
          import('@pages/exchange/exchange.module').then(
            (m) => m.ExchangeModule
          ),
      },
      {
        path: 'setting',
        loadChildren: () =>
          import('@pages/setting/setting.module').then((m) => m.SettingModule),
      },
      {
        path: 'market',
        loadChildren: () =>
          import('@pages/market/market.module').then((m) => m.MarketModule),
      },
      {
        path: 'profile',
        loadChildren: () =>
          import('@pages/profile/profile.module').then((m) => m.ProfileModule),
      },
      {
        path: 'networks',
        loadChildren: () =>
          import('@pages/networks/networks.module').then(
            (m) => m.NetworksModule
          ),
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
