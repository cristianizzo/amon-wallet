import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { TokensComponent } from '@components/tokens/tokens.component';
import { TranslateModule } from '@ngx-translate/core';
import { BackButtonModule } from '@components/back-button/back-button.module';
import { FormsModule } from '@angular/forms';
import { NgAmonPipesModule } from '@pipes/index.module';
import { NgAmonDirectivesModule } from '@directives/index.module';
import { LoaderModule } from '@components/loader/loader.component.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    TranslateModule,
    BackButtonModule,
    FormsModule,
    NgAmonPipesModule,
    NgAmonDirectivesModule,
    LoaderModule,
  ],
  exports: [TokensComponent],
  entryComponents: [],
  declarations: [TokensComponent],
})
export class TokensModule {}
