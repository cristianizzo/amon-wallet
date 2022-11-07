import {Directive, HostListener, Input, OnInit, Renderer2} from '@angular/core';
import {DomController} from '@ionic/angular';

@Directive({
  selector: '[appHideHeader]'
})
export class HideHeaderDirective implements OnInit {

  @Input('appHideHeader') toolbar: any;
  @Input() noOpacity: boolean;

  private toolbarHeight: number;
  private init: boolean;

  constructor(
    private renderer: Renderer2,
    private domCtrl: DomController,
  ) {
  }

  ngOnInit(): void {
    this.domCtrl.read(() => {
      setTimeout(() => {
        this.init = true;
        this.toolbar = this.toolbar.el;
        this.toolbarHeight = this.toolbar.clientHeight;
      }, 0);
    });

  }

  @HostListener('ionScroll', ['$event']) onContentScroll(event) {

    if (!this.init) {
      return;
    }

    const scrollTop = event.detail.scrollTop;

    let newPosition = -(scrollTop / 5);

    if (newPosition < -this.toolbarHeight) {
      newPosition = -this.toolbarHeight;
    }

    const newOpacity = 1 - (newPosition / -this.toolbarHeight);

    this.domCtrl.write(() => {
      this.renderer.setStyle(this.toolbar, 'top', `${newPosition}px`);

      if (!this.noOpacity) {

        this.renderer.setStyle(this.toolbar, 'opacity', newOpacity);

      } else {
        if (newPosition > -0.4) {
          this.renderer.setStyle(this.toolbar, 'opacity', 1);
        } else {
          this.renderer.setStyle(this.toolbar, 'opacity', 0);
        }
      }
    });

  }
}
