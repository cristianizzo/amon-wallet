import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ZXingScannerComponent } from './zxing-scanner.component';
import { IonicModule } from '@ionic/angular';

@NgModule({
  imports: [IonicModule, CommonModule, FormsModule],
  declarations: [ZXingScannerComponent],
  exports: [ZXingScannerComponent],
})
export class ZXingScannerModule {}
