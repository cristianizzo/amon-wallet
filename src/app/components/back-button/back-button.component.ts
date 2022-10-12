import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-back-button',
  templateUrl: './back-button.component.html',
  styleUrls: ['./back-button.component.scss']
})

export class BackButtonComponent implements OnChanges {

  @Input() bg: string;
  @Input() delegate: boolean;
  @Output() clicked: EventEmitter<any> = new EventEmitter<any>();

  public iconName = null;

  constructor(
    private location: Location,
  ) {
    this.getIcons();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.delegate) {
      this.delegate = changes.delegate.currentValue;
    }
    if (changes.bg && changes.bg.currentValue) {
      this.bg = changes.bg.currentValue;
      this.getIcons();
    }
  }

  getIcons() {

    this.iconName = 'back-button-white';
  }

  /**
   * goBack Function
   */
  goBack() {

    if (this.delegate) {

      this.clicked.emit();

    } else {
      this.location.back();
    }
  }

}
