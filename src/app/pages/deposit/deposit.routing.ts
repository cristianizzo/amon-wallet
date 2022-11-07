import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DepositComponent } from '@pages/deposit/component/deposit.component';

const routes: Routes = [
  {
    path: '',
    component: DepositComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DepositRoutingModule {}
