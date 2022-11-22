import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { NgAmonPipesModule } from '@pipes/index.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ChangePasswordComponent } from '@components/change-password/change-password.component';
import { BackButtonModule } from '@components/back-button/back-button.module';
import { MatPasswordStrengthModule } from '@angular-material-extensions/password-strength';
import { LoaderModule } from '@components/loader/loader.component.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    TranslateModule,
    NgAmonPipesModule,
    ReactiveFormsModule,
    BackButtonModule,
    MatPasswordStrengthModule,
    LoaderModule,
  ],
  exports: [ChangePasswordComponent],
  entryComponents: [ChangePasswordComponent],
  declarations: [ChangePasswordComponent],
})
export class ChangePasswordModule {}
