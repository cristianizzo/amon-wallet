import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CopyClipboardDirective } from '@directives/copyClipboard';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    CopyClipboardDirective,
  ],
  exports: [
    CopyClipboardDirective,
  ],
})

export class NgAmonDirectivesModule {
}
