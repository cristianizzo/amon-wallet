import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { Location } from '@angular/common';
import { ThemeSelector } from '@app/core/selectors';
import { Store } from '@ngrx/store';
import { StateModel } from '@models/state.model';

@Component({
  selector: 'app-back-button',
  templateUrl: './back-button.component.html',
  styleUrls: ['./back-button.component.scss'],
})
export class BackButtonComponent implements OnChanges {
  @Input() bg: string;
  @Input() delegate: boolean;
  @Output() clicked: EventEmitter<any> = new EventEmitter<any>();
  public selectedTheme: string;

  constructor(
    private readonly store: Store<StateModel>,
    private location: Location
  ) {
    this.store
      .select(ThemeSelector.getTheme)
      .subscribe((theme) => (this.selectedTheme = theme));
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.delegate) {
      this.delegate = changes.delegate.currentValue;
    }
    if (changes.bg && changes.bg.currentValue) {
      this.bg = changes.bg.currentValue;
    }
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
