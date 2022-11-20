import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { CustomTokenComponent } from '@components/import-token/custom-token/custom-token.component';
import { TokenListComponent } from '@components/import-token/tokens/token-list.component';
import { ImportTokenComponent } from '@components/import-token/import-token.component';
import { BackButtonModule } from '@components/back-button/back-button.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgAmonPipesModule } from '@pipes/index.module';
import { TranslateModule } from '@ngx-translate/core';
import { LoaderModule } from '@components/loader/loader.component.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    BackButtonModule,
    FormsModule,
    NgAmonPipesModule,
    TranslateModule,
    ReactiveFormsModule,
    LoaderModule,
  ],
  exports: [ImportTokenComponent, TokenListComponent, CustomTokenComponent],
  entryComponents: [
    ImportTokenComponent,
    TokenListComponent,
    CustomTokenComponent,
  ],
  declarations: [
    ImportTokenComponent,
    TokenListComponent,
    CustomTokenComponent,
  ],
})
export class ImportTokenModule {}
