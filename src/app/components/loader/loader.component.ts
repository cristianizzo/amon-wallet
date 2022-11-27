import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss'],
})
export class LoaderComponent implements OnChanges {
  @Input() loading: boolean;

  ngOnChanges(changes: SimpleChanges) {
    if (changes.loading && changes.loading.currentValue) {
      this.loading = changes.loading.currentValue;
    }
  }
}
