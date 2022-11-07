import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CopyClipboardDirective } from '@directives/copyClipboard.directive';
import { HideHeaderDirective } from '@directives/hideHeader.directive';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    CopyClipboardDirective,
    HideHeaderDirective,
  ],
  exports: [
    CopyClipboardDirective,
    HideHeaderDirective,
  ],
})

export class NgAmonDirectivesModule {
}
