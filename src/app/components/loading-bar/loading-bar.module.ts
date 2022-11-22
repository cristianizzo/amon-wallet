import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { LoadingBarComponent } from '@components/loading-bar/loading-bar.component';

@NgModule({
  imports: [IonicModule, CommonModule],
  exports: [LoadingBarComponent],
  entryComponents: [LoadingBarComponent],
  declarations: [LoadingBarComponent],
})
export class LoadingBarModule {}
