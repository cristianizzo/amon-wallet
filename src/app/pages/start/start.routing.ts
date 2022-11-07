import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@app/app.auth.guard';
import { LanguageComponent } from '@pages/start/language/language.component';
import { WelcomeComponent } from '@pages/start/welcome/welcome.component';

const routes: Routes = [
  {
    path: '',
    component: LanguageComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'welcome',
    component: WelcomeComponent,
    canActivate: [AuthGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StartRoutingModule {
}
