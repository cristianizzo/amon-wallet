import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChainsComponent } from '@pages/chains/component/chains.component';

const routes: Routes = [
  {
    path: '',
    component: ChainsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChainsRoutingModule {}
