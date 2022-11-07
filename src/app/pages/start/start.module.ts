import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StartRoutingModule } from '@pages/start/start.routing';
import { LanguageComponent } from '@pages/start/language/language.component';
import { WelcomeComponent } from '@pages/start/welcome/welcome.component';
import { BackButtonModule } from '@components/back-button/back-button.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    StartRoutingModule,
    ReactiveFormsModule,
    TranslateModule.forChild(),
    BackButtonModule,
  ],
  declarations: [
    LanguageComponent,
    WelcomeComponent,
  ],
  providers: []
})
export class StartModule {
}
