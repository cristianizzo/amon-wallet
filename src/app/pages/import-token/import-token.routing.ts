import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ImportTokenComponent } from '@pages/import-token/component/import-token.component';

const routes: Routes = [
  {
    path: '',
    component: ImportTokenComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ImportTokenRoutingModule {}
