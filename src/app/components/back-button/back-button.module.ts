import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { BackButtonComponent } from '@components/back-button/back-button.component';

@NgModule({
  imports: [IonicModule, CommonModule],
  exports: [BackButtonComponent],
  entryComponents: [BackButtonComponent],
  declarations: [BackButtonComponent],
})
export class BackButtonModule {}
