import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { CustomTokenComponent } from '@pages/import-token/custom-token/custom-token.component';
import { TokenListComponent } from '@pages/import-token/token-list/token-list.component';
import { ImportTokenComponent } from '@pages/import-token/component/import-token.component';
import { BackButtonModule } from '@components/back-button/back-button.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgAmonPipesModule } from '@pipes/index.module';
import { TranslateModule } from '@ngx-translate/core';
import { LoaderModule } from '@components/loader/loader.component.module';
import { ImportTokenRoutingModule } from '@pages/import-token/import-token.routing';
import { NgAmonDirectivesModule } from '@directives/index.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ImportTokenRoutingModule,
    BackButtonModule,
    TranslateModule,
    NgAmonDirectivesModule,
    NgAmonPipesModule,
    ReactiveFormsModule,
    LoaderModule,
  ],
  declarations: [
    ImportTokenComponent,
    TokenListComponent,
    CustomTokenComponent,
  ],
})
export class ImportTokenModule {}
