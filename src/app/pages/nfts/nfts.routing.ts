import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NftsComponent } from '@pages/nfts/component/nfts.component';

const routes: Routes = [
  {
    path: '',
    component: NftsComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NftsRoutingModule {
}
