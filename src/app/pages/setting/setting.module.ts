import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SettingRoutingModule } from '@pages/setting/setting.routing';
import { SettingComponent } from '@pages/setting/component/setting.component';
import { NgAmonPipesModule } from '@pipes/index.module';
import { TranslateModule } from '@ngx-translate/core';
import { BackButtonModule } from '@components/back-button/back-button.module';
import { NgAmonDirectivesModule } from '@directives/index.module';
import { CurrencySelectorModule } from '@components/currency-selector/currency-selector.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    SettingRoutingModule,
    ReactiveFormsModule,
    NgAmonPipesModule,
    TranslateModule,
    BackButtonModule,
    NgAmonDirectivesModule,
    CurrencySelectorModule
  ],
  declarations: [SettingComponent],
  providers: [],
})
export class SettingModule {}
